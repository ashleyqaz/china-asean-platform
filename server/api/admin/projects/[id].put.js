import prisma from '../../../utils/prisma'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const item = await prisma.project.update({ where: { id }, data: { name: body.name, participants: body.participants, startDate: body.start_date, endDate: body.end_date, description: body.description, coverImage: body.cover_image, isFeatured: body.is_featured } })
  return { code: 200, message: '更新成功', data: item }
})
