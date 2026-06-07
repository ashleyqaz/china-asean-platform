import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const data = {
    title: body.title,
    content: body.content,
    summary: body.summary,
    coverImage: body.cover_image,
    isPublished: body.is_published
  }
  if (body.publish_time) {
    data.publishTime = new Date(body.publish_time)
  }
  const article = await prisma.newsArticle.update({ where: { id }, data })
  return { code: 200, message: '更新成功', data: article }
})
