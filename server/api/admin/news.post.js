import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const article = await prisma.newsArticle.create({
    data: {
      title: body.title,
      content: body.content || '',
      summary: body.summary || '',
      coverImage: body.cover_image || null,
      publishTime: body.publish_time ? new Date(body.publish_time) : new Date(),
      isPublished: body.is_published !== undefined ? body.is_published : true
    }
  })
  return { code: 200, message: '创建成功', data: article }
})
