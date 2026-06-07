import prisma from '../../utils/prisma'
export default defineEventHandler(async () => {
  const items = await prisma.subscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
  return { code: 200, message: 'success', data: items }
})
