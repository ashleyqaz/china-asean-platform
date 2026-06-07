import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const items = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  return { code: 200, message: 'success', data: items }
})
