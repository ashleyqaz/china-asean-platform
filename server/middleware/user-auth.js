import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
  const url = event.path

  // 需要用户认证的路由
  if (url === '/api/messages' && event.method === 'POST') {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({ statusCode: 401, message: '请先登录' })
    }

    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (!payload) {
      throw createError({ statusCode: 401, message: '登录已过期，请重新登录' })
    }

    // 确保是用户token（不是管理员token）
    if (!payload.userId && payload.id && !payload.username) {
      // 用户token存储为 { userId: user.id }
      event.context.user = { id: payload.userId || payload.id }
    } else if (payload.phone) {
      event.context.user = payload
    } else {
      throw createError({ statusCode: 401, message: '请使用用户账号登录' })
    }
  }
})
