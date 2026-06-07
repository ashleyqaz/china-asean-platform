import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const unit = await prisma.supportUnit.create({
    data: {
      categoryId: body.category_id,
      name: body.name,
      logoUrl: body.logo_url || null,
      websiteUrl: body.website_url || null,
      sortOrder: body.sort_order || 0
    }
  })
  return { code: 200, message: '创建成功', data: unit }
})
