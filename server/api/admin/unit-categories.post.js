import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const category = await prisma.unitCategory.create({
    data: {
      name: body.name,
      sortOrder: body.sort_order || 0
    }
  })
  return { code: 200, message: '创建成功', data: category }
})
