// 全站静态化配置 — 模仿外交部网站 (www.fmprc.gov.cn) 预生成HTML架构
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // ========== 应用全局配置 ==========
  app: {
    head: {
      title: '中国—东盟气候智慧型热带农业协同平台',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '中国—东盟气候智慧型热带农业协同平台，致力于推动气候智慧型热带农业技术交流与合作，促进区域农业可持续发展。' },
        { name: 'keywords', content: '中国东盟,气候智慧型农业,热带农业,绿色低碳,农业合作' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '中国—东盟气候智慧型热带农业协同平台' },
        { property: 'og:description', content: '致力于推动气候智慧型热带农业技术交流与合作' },
        { property: 'og:site_name', content: '中国—东盟气候智慧型热带农业协同平台' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: '中国—东盟气候智慧型热带农业协同平台' },
        { name: 'twitter:description', content: '致力于推动气候智慧型热带农业技术交流与合作' },
        // 安全头
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  // ========== Nitro 服务端引擎配置 ==========
  nitro: {
    preset: 'node-server',         // 混合模式：预渲染页面静态生成 + API 动态运行
    prerender: {
      crawlLinks: true,            // 自动爬取页面中的链接并预渲染
      routes: [
        '/',
        '/category/agriculture-climate-response',
        '/category/climate-policy-system',
        '/category/international-org-updates',
        '/category/china-asean-updates',
        '/category/green-low-carbon-agriculture',
        '/category/climate-smart-tech-experience',
        '/category/green-trade-barriers',
        '/category/tech-exchange-interaction',
        '/units/1',
        '/units/2',
        '/units/3'
      ],
      // 失败时不阻塞构建
      failOnError: false
    },
    // 静态资源缓存策略
    serveStatic: true,
    // 压缩
    compressPublicAssets: true,
    // 输出目录
    output: {
      dir: '.output',
      publicDir: '.output/public'
    }
  },

  // ========== 路由生成策略 ==========
  routeRules: {
    // 前台页面 — 全部静态生成（SSG）
    '/': { prerender: true },
    '/category/**': { prerender: true },
    '/units/**': { prerender: true },
    '/news/**': { prerender: true },
    '/about': { prerender: true },
    '/downloads': { prerender: true },
    '/experts': { prerender: true },
    '/projects': { prerender: true },
    '/data': { prerender: true },
    '/search': { prerender: true },
    // SPA 模式页面（需要运行时交互）
    '/message': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/user/**': { ssr: false },
    // 管理后台 — SPA模式，不预渲染
    '/admin/**': { ssr: false },
    // 静态资源 — 长期缓存（部署到CDN）
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  // ========== 全局 CSS ==========
  css: ['~/assets/css/variables.css', '~/assets/css/global.css'],

  // ========== Vite 配置 ==========
  vite: {}
})
