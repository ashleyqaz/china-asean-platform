import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const categories = await prisma.unitCategory.findMany({
    orderBy: { sortOrder: 'asc' }
  })
  return { code: 200, message: 'success', data: categories }
})
