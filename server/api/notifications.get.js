import prisma from '../utils/prisma'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '请先登录' })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) throw createError({ statusCode: 401, message: '登录已过期' })

  const userId = payload.userId || payload.id
  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  return { code: 200, message: 'success', data: items }
})
