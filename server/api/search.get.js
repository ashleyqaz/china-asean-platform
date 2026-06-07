import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = (query.q || '').trim()
  const page = parseInt(query.page) || 1
  const size = parseInt(query.size) || 10

  if (!q) {
    return { code: 200, message: 'success', data: { items: [], total: 0 } }
  }

  const skip = (page - 1) * size
  const keyword = `%${q}%`

  // 使用 Prisma raw query 搜索 SQLite
  const [items, totalResult] = await Promise.all([
    prisma.$queryRawUnsafe(
      `SELECT id, title, summary, publish_time FROM news_articles WHERE is_published = 1 AND (title LIKE ? OR content LIKE ? OR summary LIKE ?) ORDER BY publish_time DESC LIMIT ? OFFSET ?`,
      keyword, keyword, keyword, size, skip
    ),
    prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as cnt FROM news_articles WHERE is_published = 1 AND (title LIKE ? OR content LIKE ? OR summary LIKE ?)`,
      keyword, keyword, keyword
    )
  ])

  const total = totalResult[0]?.cnt || 0

  return { code: 200, message: 'success', data: { items, total, page, size } }
})
