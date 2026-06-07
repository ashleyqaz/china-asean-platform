import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const category = await prisma.unitCategory.update({
    where: { id },
    data: { name: body.name, sortOrder: body.sort_order }
  })
  return { code: 200, message: '更新成功', data: category }
})
