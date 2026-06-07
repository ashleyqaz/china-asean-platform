import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug
  if (!slug) throw createError({ statusCode: 400, message: '缺少slug参数' })

  const content = await prisma.categoryContent.findUnique({ where: { slug } })
  return { code: 200, message: 'success', data: content || { slug, content: '' } }
})
