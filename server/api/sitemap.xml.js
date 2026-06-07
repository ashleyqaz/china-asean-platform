import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const baseUrl = process.env.SITE_URL || 'https://china-asean-platform.example.com'

  const staticRoutes = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/message', changefreq: 'monthly', priority: '0.5' },
  ]

  // 从数据库获取导航菜单 → 生成栏目页 URL
  let navSlugs = []
  try {
    const navMenus = await prisma.navMenu.findMany({ where: { isVisible: true }, select: { slug: true } })
    navSlugs = navMenus.map(m => `/category/${m.slug}`)
  } catch { /* 构建时数据库可能不可用，静默跳过 */ }

  // 从数据库获取支撑单位分类 → 生成单位列表页 URL
  let unitCatIds = []
  try {
    const categories = await prisma.unitCategory.findMany({ select: { id: true } })
    unitCatIds = categories.map(c => `/units/${c.id}`)
  } catch { /* 构建时数据库可能不可用 */ }

  // 从数据库获取资讯 → 生成资讯详情页 URL
  let newsIds = []
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      select: { id: true },
      orderBy: { publishTime: 'desc' }
    })
    newsIds = articles.map(a => `/news/${a.id}`)
  } catch { /* 构建时数据库可能不可用 */ }

  const allRoutes = [...staticRoutes]

  for (const slug of navSlugs) {
    allRoutes.push({ loc: slug, changefreq: 'weekly', priority: '0.8' })
  }
  for (const path of unitCatIds) {
    allRoutes.push({ loc: path, changefreq: 'weekly', priority: '0.7' })
  }
  for (const path of newsIds) {
    allRoutes.push({ loc: path, changefreq: 'weekly', priority: '0.6' })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${baseUrl}${r.loc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader('Content-Type', 'application/xml; charset=utf-8')
  return xml
})
