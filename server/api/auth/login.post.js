import crypto from 'crypto'
import prisma from '../../utils/prisma'
import { signToken } from '../../utils/jwt'

function hash(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.phone || !body.password) {
    throw createError({ statusCode: 400, message: '请输入手机号和密码' })
  }

  const user = await prisma.user.findUnique({ where: { phone: body.phone } })
  if (!user) {
    throw createError({ statusCode: 401, message: '手机号或密码错误' })
  }

  if (hash(body.password) !== user.passwordHash) {
    throw createError({ statusCode: 401, message: '手机号或密码错误' })
  }

  const token = signToken({ userId: user.id, phone: user.phone, type: 'user' })

  return {
    code: 200,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        realName: user.realName
      }
    }
  }
})
