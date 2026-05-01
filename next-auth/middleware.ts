import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'zh',
  
  // 本地化路径前缀
  localePrefix: 'as-needed'
});

export const config = {
  // 匹配所有路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 