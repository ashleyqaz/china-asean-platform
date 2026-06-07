import prisma from '../../utils/prisma'
export default defineEventHandler(async () => {
  const items = await prisma.expert.findMany({ orderBy: { sortOrder: 'asc' } })
  return { code: 200, message: 'success', data: items }
})
