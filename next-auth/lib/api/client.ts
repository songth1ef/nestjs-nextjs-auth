import { API_CONFIG, API_ENDPOINTS } from './config';
import { handleResponse, handleError } from './utils';

// 定义OAuth客户端接口
export interface OAuthClient {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建OAuth客户端DTO
export interface CreateClientDto {
  name: string;
  description?: string;
  redirectUris: string[];
  scopes: string[];
}

// 用户接口
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  lastLoginDate?: string;
}

// 分页元数据
export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

class ApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.headers = API_CONFIG.headers;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') {
        console.warn('未找到有效的token或token为undefined');
        return null;
      }
      return token;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    // 构建请求头，如果有token则添加Authorization头
    const headers: Record<string, string> = {
      ...this.headers as Record<string, string>,
      ...(options.headers as Record<string, string> || {}),
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`发送请求到 ${endpoint} 带有token: ${token.substring(0, 10)}...`);
    } else {
      console.log(`发送请求到 ${endpoint} 无token`);
    }
    
    const config: RequestInit = {
      ...options,
      headers,
      credentials: API_CONFIG.withCredentials ? 'include' : 'same-origin',
      mode: 'cors', // 添加CORS模式
    };

    console.log('请求配置:', {
      url,
      method: options.method || 'GET',
      headers: config.headers,
      credentials: config.credentials,
    });

    try {
      const response = await fetch(url, config);
      console.log('收到响应:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('请求失败:', error);
      return handleError(error as Error);
    }
  }

  // Auth API
  async login(data: { email?: string; username?: string; password: string }): Promise<LoginResponse> {
    const response = await this.request<{
      code: number,
      data: {
        access_token: string,
        refresh_token: string,
        preferred_language: string
      },
      message: string,
      success: boolean,
      timestamp: number
    }>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // 登录成功后直接存储token
    if (response && response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('auth', 'true');
      console.log('登录成功，已存储token');
    }
    
    // 转换为预期的LoginResponse格式
    return {
      token: response.data.access_token,
      user: {
        id: '', // 接口没有返回用户信息，先留空
        username: '',
        email: '',
        roles: []
      }
    };
  }

  async register(data: {
    email: string;
    password: string;
    username: string;
  }) {
    return this.request(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    // 登出时清除token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
    }
    
    return this.request(API_ENDPOINTS.auth.logout, {
      method: 'POST',
    });
  }

  async refreshToken() {
    const response = await this.request<{token: string}>(API_ENDPOINTS.auth.refresh, {
      method: 'POST',
    });
    
    // 刷新token成功后更新存储的token
    if (response && response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async forgotPassword(email: string) {
    return this.request(API_ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    password: string;
  }) {
    return this.request(API_ENDPOINTS.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User API
  async getUsers(params: { 
    page?: number; 
    limit?: number; 
    search?: string | undefined; 
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return this.request(`${API_ENDPOINTS.user.users}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.user.profile, {
      method: 'GET',
    });
  }

  async updateProfile(data: {
    username?: string;
    email?: string;
  }) {
    return this.request(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }) {
    return this.request(API_ENDPOINTS.user.changePassword, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  // OAuth API
  async getOAuthClients(): Promise<OAuthClient[]> {
    const response = await this.request<{ data: OAuthClient[] } | OAuthClient[]>(API_ENDPOINTS.oauth.clients, {
      method: 'GET',
    });
    
    // 确保返回数组类型
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    console.error('OAuth客户端响应格式不正确:', response);
    return [];
  }
  
  async getOAuthClient(id: string): Promise<OAuthClient> {
    return this.request(`${API_ENDPOINTS.oauth.clients}/${id}`, {
      method: 'GET',
    });
  }
  
  async createOAuthClient(data: CreateClientDto): Promise<OAuthClient> {
    return this.request(API_ENDPOINTS.oauth.clients, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async deleteOAuthClient(id: string): Promise<void> {
    return this.request(`${API_ENDPOINTS.oauth.clients}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(); 