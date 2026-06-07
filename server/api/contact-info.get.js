import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const info = await prisma.contactInfo.findMany()
  const result = {}
  for (const item of info) {
    result[item.keyName] = item.value
  }
  return { code: 200, message: 'success', data: result }
})
