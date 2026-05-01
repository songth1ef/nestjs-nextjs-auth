# Next.js 多语言认证前端

这是一个基于 Next.js 15 的多语言认证系统前端项目，使用 TypeScript 开发。

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- next-intl (国际化)
- React Hook Form
- Axios

## 环境要求

- Node.js 18+
- npm 9+

## 环境变量配置

创建 `.env.local` 文件并配置以下环境变量：

```bash
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8101
NEXT_PUBLIC_APP_URL=http://localhost:8102

# 认证配置
NEXTAUTH_URL=http://localhost:8102
NEXTAUTH_SECRET=your-secret-key

# 其他配置
NODE_ENV=development
```

## 开发

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

开发服务器将在 http://localhost:8102 启动。

## 构建

```bash
npm run build
```

## 生产环境运行

```bash
npm start
```

## 项目结构

```
├── app/                # Next.js 应用目录
├── components/         # React 组件
│   ├── ui/            # UI 基础组件
│   └── ...            # 业务组件
├── lib/               # 工具库
│   ├── api/           # API 客户端
│   └── i18n/          # 国际化配置
├── public/            # 静态资源
└── styles/            # 样式文件
```

## 国际化支持

- 支持中文和英文
- 使用 next-intl 进行国际化
- 支持动态切换语言

## API 集成

- 与后端 API (8101 端口) 集成
- 支持 JWT 认证
- 支持 OAuth 客户端管理

## 开发指南

1. 组件开发
   - 使用 TypeScript
   - 遵循 React Hooks 最佳实践
   - 使用 Tailwind CSS 进行样式开发

2. API 调用
   - 使用封装的 API 客户端
   - 统一错误处理
   - 支持请求拦截和响应拦截

3. 国际化
   - 使用 next-intl 的 hooks
   - 遵循翻译文件结构
   - 支持动态加载翻译

## 部署

推荐使用 Vercel 进行部署：

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
