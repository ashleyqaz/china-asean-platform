import prisma from '../../../utils/prisma'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  const item = await prisma.expert.update({ where: { id }, data: { name: body.name, title: body.title, avatarUrl: body.avatar_url, organization: body.organization, field: body.field, bio: body.bio, sortOrder: body.sort_order } })
  return { code: 200, message: '更新成功', data: item }
})
