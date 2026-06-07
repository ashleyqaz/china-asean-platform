import prisma from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const message = await prisma.message.update({
    where: { id },
    data: {
      reply: body.reply,
      repliedAt: new Date(),
      isRead: true
    }
  })
  return { code: 200, message: '回复成功', data: message }
})
