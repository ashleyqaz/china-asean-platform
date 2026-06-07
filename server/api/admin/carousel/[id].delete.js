import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  await prisma.carouselItem.delete({ where: { id } })
  return { code: 200, message: '删除成功' }
})
