import crypto from 'crypto'
import prisma from '../../utils/prisma'

function hash(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 第一步：验证手机号
  if (body.step === 1) {
    if (!body.phone || !body.code) {
      throw createError({ statusCode: 400, message: '请输入手机号和验证码' })
    }

    const smsCode = await prisma.smsCode.findFirst({
      where: { phone: body.phone, code: body.code },
      orderBy: { expiresAt: 'desc' }
    })

    if (!smsCode) {
      throw createError({ statusCode: 400, message: '验证码错误' })
    }

    if (new Date() > smsCode.expiresAt) {
      throw createError({ statusCode: 400, message: '验证码已过期' })
    }

    // 验证通过，删除验证码
    await prisma.smsCode.deleteMany({ where: { phone: body.phone } })

    return { code: 200, message: '手机号验证通过', data: { phone_verified: true } }
  }

  // 第二步：提交注册信息
  if (body.step === 2) {
    if (!body.phone || !body.password || !body.real_name || !body.id_card) {
      throw createError({ statusCode: 400, message: '请填写所有必填字段' })
    }

    if (body.password.length < 6) {
      throw createError({ statusCode: 400, message: '密码长度至少6位' })
    }

    // 检查手机号是否已注册
    const exist = await prisma.user.findUnique({ where: { phone: body.phone } })
    if (exist) {
      throw createError({ statusCode: 400, message: '该手机号已注册' })
    }

    const user = await prisma.user.create({
      data: {
        phone: body.phone,
        passwordHash: hash(body.password),
        realName: body.real_name,
        idCard: body.id_card
      }
    })

    return {
      code: 200,
      message: '注册成功',
      data: { id: user.id, phone: user.phone, realName: user.realName }
    }
  }

  throw createError({ statusCode: 400, message: '无效的步骤' })
})
