import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const menuSlug = query.menuSlug
  const where = menuSlug ? { menuSlug } : {}
  const items = await prisma.subCategory.findMany({ where, orderBy: { sortOrder: 'asc' } })
  return { code: 200, message: 'success', data: items }
})
