import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const qrcode = await prisma.qrcodeConfig.findFirst()
  return { code: 200, message: 'success', data: qrcode || { imageUrl: '' } }
})
