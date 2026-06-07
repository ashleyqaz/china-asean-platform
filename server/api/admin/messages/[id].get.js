import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const message = await prisma.message.findUnique({
    where: { id },
    include: { user: { select: { id: true, phone: true, realName: true } } }
  })
  if (!message) {
    throw createError({ statusCode: 404, message: '留言不存在' })
  }
  return { code: 200, message: 'success', data: message }
})
