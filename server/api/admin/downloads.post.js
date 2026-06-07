import prisma from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const item = await prisma.download.create({ data: { title: body.title, category: body.category, fileUrl: body.file_url, fileSize: body.file_size || '', description: body.description || '' } })
  return { code: 200, message: '创建成功', data: item }
})
