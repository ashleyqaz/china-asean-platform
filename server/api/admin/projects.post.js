import prisma from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const item = await prisma.project.create({ data: { name: body.name, participants: body.participants, startDate: body.start_date, endDate: body.end_date, description: body.description, coverImage: body.cover_image || null, isFeatured: body.is_featured || false } })
  return { code: 200, message: '创建成功', data: item }
})
