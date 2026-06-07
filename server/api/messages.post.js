import prisma from '../utils/prisma'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 用户认证检查
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: '请先登录后再留言' })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: '登录已过期，请重新登录' })
  }

  const userId = payload.userId || payload.id

  // 从用户表获取用户信息
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw createError({ statusCode: 401, message: '用户不存在' })
  }

  // 校验
  if (!body.category) {
    throw createError({ statusCode: 400, message: '请选择留言对象' })
  }

  if (!body.title || body.title.length > 22) {
    throw createError({ statusCode: 400, message: '标题不能为空且不超过22字' })
  }

  if (/[@#$%^&*]/.test(body.title)) {
    throw createError({ statusCode: 400, message: '标题请勿填写特殊符号' })
  }

  if (!body.content || body.content.length < 10) {
    throw createError({ statusCode: 400, message: '留言内容至少10个字符' })
  }

  if (body.content.length > 1000) {
    throw createError({ statusCode: 400, message: '留言内容不能超过1000个字符' })
  }

  const validCategories = ['交流', '提供经验', '信息', '项目合作建议', '考察交流']
  if (!validCategories.includes(body.category)) {
    throw createError({ statusCode: 400, message: '请选择有效的留言对象' })
  }

  const message = await prisma.message.create({
    data: {
      userId: user.id,
      category: body.category,
      senderName: user.realName,
      senderPhone: user.phone,
      senderEmail: body.sender_email || null,
      title: body.title || '',
      content: body.content,
      attachment: body.attachment || ''
    }
  })

  return { code: 200, message: '留言提交成功，感谢您的留言！', data: message }
})
