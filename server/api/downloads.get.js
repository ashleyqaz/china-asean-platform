import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category
  const where = category ? { category } : {}
  const items = await prisma.download.findMany({ where, orderBy: { createdAt: 'desc' } })
  return { code: 200, message: 'success', data: items }
})
