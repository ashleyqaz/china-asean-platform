import prisma from '../../../utils/prisma'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const item = await prisma.download.update({ where: { id }, data: { title: body.title, category: body.category, fileUrl: body.file_url, fileSize: body.file_size, description: body.description } })
  return { code: 200, message: '更新成功', data: item }
})
