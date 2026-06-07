import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const menu = await prisma.navMenu.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      sortOrder: body.sort_order,
      isHighlight: body.is_highlight,
      isVisible: body.is_visible
    }
  })
  return { code: 200, message: '更新成功', data: menu }
})
