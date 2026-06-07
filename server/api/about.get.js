import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const about = await prisma.aboutPage.findFirst()
  return { code: 200, message: 'success', data: about || { content: '' } }
})
