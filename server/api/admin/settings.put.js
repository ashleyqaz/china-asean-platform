import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 更新联系信息
  const contactKeys = ['address', 'phone', 'email', 'fax', 'header_note']
  for (const key of contactKeys) {
    if (body[key] !== undefined) {
      await prisma.contactInfo.upsert({
        where: { keyName: key },
        update: { value: body[key] },
        create: { keyName: key, value: body[key] }
      })
    }
  }

  // 更新二维码
  if (body.qrcode_url) {
    await prisma.qrcodeConfig.upsert({
      where: { id: 1 },
      update: { imageUrl: body.qrcode_url },
      create: { id: 1, imageUrl: body.qrcode_url }
    })
  }

  // 更新站点配置
  if (body.site_name || body.copyright_text || body.icp_number) {
    const data = {}
    if (body.site_name) data.siteName = body.site_name
    if (body.copyright_text) data.copyrightText = body.copyright_text
    if (body.icp_number) data.icpNumber = body.icp_number
    await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    })
  }

  return { code: 200, message: '设置更新成功' }
})
