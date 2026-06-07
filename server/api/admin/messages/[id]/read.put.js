import prisma from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const message = await prisma.message.update({
    where: { id },
    data: { isRead: true }
  })
  return { code: 200, message: '已标记为已读', data: message }
})
