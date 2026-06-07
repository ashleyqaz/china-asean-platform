import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const menu = await prisma.navMenu.create({
    data: {
      name: body.name,
      slug: body.slug,
      sortOrder: body.sort_order || 0,
      isHighlight: body.is_highlight || false,
      isVisible: body.is_visible !== undefined ? body.is_visible : true
    }
  })
  return { code: 200, message: '创建成功', data: menu }
})
