import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.categoryId ? parseInt(query.categoryId) : undefined
  const where = categoryId ? { categoryId } : {}
  const units = await prisma.supportUnit.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: { category: true }
  })
  return { code: 200, message: 'success', data: units }
})
