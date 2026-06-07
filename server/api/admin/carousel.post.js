import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const item = await prisma.carouselItem.create({
    data: {
      imageUrl: body.image_url,
      title: body.title || '',
      caption: body.caption || '',
      linkUrl: body.link_url || null,
      sortOrder: body.sort_order || 0,
      isVisible: body.is_visible !== undefined ? body.is_visible : true
    }
  })
  return { code: 200, message: '创建成功', data: item }
})
