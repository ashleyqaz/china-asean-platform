import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page) || 1
  const size = parseInt(query.size) || 6
  const skip = (page - 1) * size
  const categorySlug = query.categorySlug || null

  const where = { isPublished: true }
  if (categorySlug) {
    const slugs = categorySlug.split(',').map(s => s.trim()).filter(Boolean)
    if (slugs.length === 1) {
      where.categorySlug = slugs[0]
    } else if (slugs.length > 1) {
      where.categorySlug = { in: slugs }
    }
  }

  const [items, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: { publishTime: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        coverImage: true,
        publishTime: true,
        categorySlug: true
      },
      skip,
      take: size
    }),
    prisma.newsArticle.count({ where })
  ])

  return {
    code: 200,
    message: 'success',
    data: { items, total, page, size }
  }
})
