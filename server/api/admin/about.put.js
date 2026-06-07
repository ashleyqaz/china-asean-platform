import prisma from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await prisma.aboutPage.upsert({ where: { id: 1 }, update: { content: body.content }, create: { id: 1, content: body.content } })
  return { code: 200, message: '保存成功' }
})
