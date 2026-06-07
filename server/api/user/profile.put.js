import prisma from '../../utils/prisma'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw createError({ statusCode: 401, message: '请先登录' })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) throw createError({ statusCode: 401, message: '登录已过期' })

  const userId = payload.userId || payload.id
  const body = await readBody(event)

  const data = {}
  if (body.real_name) data.realName = body.real_name
  if (body.email) data.email = body.email

  await prisma.user.update({ where: { id: userId }, data })
  return { code: 200, message: '更新成功' }
})
