import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const item = await prisma.carouselItem.update({
    where: { id },
    data: {
      imageUrl: body.image_url,
      title: body.title,
      caption: body.caption,
      linkUrl: body.link_url,
      sortOrder: body.sort_order,
      isVisible: body.is_visible
    }
  })
  return { code: 200, message: '更新成功', data: item }
})
