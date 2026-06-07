import crypto from 'crypto'
import prisma from '../../utils/prisma'
import { signToken } from '../../utils/jwt'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({ statusCode: 400, message: '请输入用户名和密码' })
  }

  const admin = await prisma.admin.findUnique({ where: { username: body.username } })
  if (!admin) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  if (hashPassword(body.password) !== admin.passwordHash) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  const token = signToken({ id: admin.id, username: admin.username })
  return { code: 200, message: '登录成功', data: { token, username: admin.username } }
})
