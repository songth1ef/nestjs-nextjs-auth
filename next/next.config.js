/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 添加路径别名
    config.resolve.alias['@'] = __dirname + '/src'
    return config
  },
  // 构建时忽略类型错误
  typescript: {
    ignoreBuildErrors: true
  },
  // 构建时忽略ESLint错误
  eslint: {
    ignoreDuringBuilds: true
  },
  // 设置更长的构建超时时间
  // staticPageGenerationTimeout: 180,
  experimental: {
    // 禁用热重载以提高构建性能
    webpackBuildWorker: false,
    // 增加ServerComponents建超时
    serverComponentsExternalPackages: []
  },
  // 添加API代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8101/api/:path*',
        basePath: false
      }
    ]
  },
  // 添加CORS配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  }
}

module.exports = nextConfig 