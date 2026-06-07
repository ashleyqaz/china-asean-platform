import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const article = await prisma.newsArticle.findUnique({ where: { id } })
  if (!article) throw createError({ statusCode: 404, message: '资讯不存在' })

  let categoryName = ''
  let categorySortOrder = 0
  let subCategoryName = ''

  if (article.categorySlug) {
    const menu = await prisma.navMenu.findUnique({ where: { slug: article.categorySlug } })
    if (menu) { categoryName = menu.name; categorySortOrder = menu.sortOrder }
  }
  if (article.subCategoryId) {
    const sub = await prisma.subCategory.findUnique({ where: { id: article.subCategoryId } })
    if (sub) subCategoryName = sub.name
  }

  return { code: 200, message: 'success', data: { categoryName, subCategoryName, subCategoryId: article.subCategoryId ?? null, categorySlug: article.categorySlug, categorySortOrder } }
})
