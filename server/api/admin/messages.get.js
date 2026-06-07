import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page) || 1
  const size = parseInt(query.size) || 20
  const skip = (page - 1) * size

  const where = {}
  if (query.status === 'unread') where.isRead = false
  else if (query.status === 'read') where.isRead = true

  const [items, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: size,
      include: { user: { select: { id: true, phone: true, realName: true } } }
    }),
    prisma.message.count({ where })
  ])

  return { code: 200, message: 'success', data: { items, total, page, size } }
})
