import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const unit = await prisma.supportUnit.update({
    where: { id },
    data: {
      categoryId: body.category_id,
      name: body.name,
      logoUrl: body.logo_url,
      websiteUrl: body.website_url,
      sortOrder: body.sort_order
    }
  })
  return { code: 200, message: '更新成功', data: unit }
})
