import prisma from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const item = await prisma.expert.create({ data: { name: body.name, title: body.title, avatarUrl: body.avatar_url || '', organization: body.organization, field: body.field, bio: body.bio, sortOrder: body.sort_order || 0 } })
  return { code: 200, message: '创建成功', data: item }
})
