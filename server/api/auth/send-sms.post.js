import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.phone || !/^1[3-9]\d{9}$/.test(body.phone)) {
    throw createError({ statusCode: 400, message: '请输入有效的手机号' })
  }

  // 生成6位验证码
  const code = String(Math.floor(100000 + Math.random() * 900000))

  // 删除旧的验证码
  await prisma.smsCode.deleteMany({ where: { phone: body.phone } })

  // 保存新验证码，5分钟有效期
  await prisma.smsCode.create({
    data: {
      phone: body.phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  })

  // 模拟发送 — 控制台打印
  console.log(`[SMS] 验证码发送至 ${body.phone}: ${code}`)

  return { code: 200, message: '验证码已发送', data: { phone: body.phone, code } }
})
