import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
  const url = event.path

  if (url.startsWith('/api/admin') && url !== '/api/admin/login') {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({ statusCode: 401, message: '未登录或登录已过期' })
    }

    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (!payload) {
      throw createError({ statusCode: 401, message: '登录已过期，请重新登录' })
    }

    event.context.admin = payload
  }
})
