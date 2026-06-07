import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page) || 1
  const size = parseInt(query.size) || 20
  const skip = (page - 1) * size

  const [items, total] = await Promise.all([
    prisma.newsArticle.findMany({
      orderBy: { publishTime: 'desc' },
      skip,
      take: size
    }),
    prisma.newsArticle.count()
  ])

  return { code: 200, message: 'success', data: { items, total, page, size } }
})
