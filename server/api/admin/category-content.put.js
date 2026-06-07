import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.slug) throw createError({ statusCode: 400, message: '缺少slug' })

  await prisma.categoryContent.upsert({
    where: { slug: body.slug },
    update: { content: body.content },
    create: { slug: body.slug, content: body.content }
  })
  return { code: 200, message: '保存成功' }
})
