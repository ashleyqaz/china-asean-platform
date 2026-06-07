import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const config = await prisma.siteConfig.findFirst()
  return { code: 200, message: 'success', data: config || {} }
})
