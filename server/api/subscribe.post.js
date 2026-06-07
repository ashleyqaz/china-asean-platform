import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({ statusCode: 400, message: '请输入有效的邮箱地址' })
  }

  const exist = await prisma.subscriber.findUnique({ where: { email: body.email } })
  if (exist) {
    return { code: 200, message: '您已订阅，无需重复订阅' }
  }

  await prisma.subscriber.create({ data: { email: body.email } })
  return { code: 200, message: '订阅成功，感谢您的关注！' }
})
