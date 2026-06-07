import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const article = await prisma.newsArticle.findUnique({ where: { id } })
  if (!article) {
    throw createError({ statusCode: 404, message: '资讯不存在' })
  }
  return { code: 200, message: 'success', data: article }
})
