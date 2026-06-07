import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const menus = await prisma.navMenu.findMany({ orderBy: { sortOrder: 'asc' } })
  return { code: 200, message: 'success', data: menus }
})
