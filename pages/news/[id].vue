<template>
  <div class="news-detail-page">
    <div class="container">
      <!-- 面包屑：首页 > 一级栏目 > 子栏目 > 标题 -->
      <nav class="breadcrumb">
        <NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink>
        <span class="separator"> &gt; </span>
        <span class="crumb-mid">{{ categoryDisplayName }}</span>
        <span class="separator"> &gt; </span>
        <NuxtLink v-if="meta.categorySlug" :to="`/category/${meta.categorySlug}${meta.subCategoryId ? '?subId=' + meta.subCategoryId : ''}`" class="sub-link">{{ meta.subCategoryName }}</NuxtLink>
        <span v-else class="crumb-mid">{{ meta.subCategoryName }}</span>
        <span class="separator"> &gt; </span>
        <span class="current">{{ article?.title || t('breadcrumb.detail') }}</span>
      </nav>

      <template v-if="article">
        <article class="article">
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-time">{{ formatDate(article.publishTime) }}</p>
          <div class="article-content" v-html="article.content"></div>
        </article>
        <div class="back-wrap">
          <button class="btn-back" @click="navigateTo('/')">{{ t('newsDetail.backHome') }}</button>
        </div>
      </template>
      <div v-else class="loading">{{ t('common.loading') }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute()
const article = ref(null)
const meta = ref({ categoryName: '', subCategoryName: '', subCategoryId: null, categorySlug: '', categorySortOrder: 0 })

// 翻译后的一级栏目名（通过 nav.N 翻译键）
const categoryDisplayName = computed(() => {
  if (!meta.value.categorySortOrder) return meta.value.categoryName
  const translated = t(`nav.${meta.value.categorySortOrder}`)
  return translated !== `nav.${meta.value.categorySortOrder}` ? translated : meta.value.categoryName
})

onMounted(async () => {
  try {
    const [res, metaRes] = await Promise.all([
      $fetch(`/api/news/${route.params.id}`),
      $fetch(`/api/news-meta/${route.params.id}`)
    ])
    if (res.code === 200) article.value = res.data
    if (metaRes.code === 200) meta.value = metaRes.data
  } catch (e) { console.error(e) }
})

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

definePageMeta({ layout: 'default' })
usePageSeo({
  title: computed(() => article.value?.title || ''),
  description: computed(() => article.value?.summary || '')
})
</script>

<style scoped>
.news-detail-page { padding-top: 30px; min-height: 60vh; padding-bottom: 60px; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px; padding: 8px 0; }
.breadcrumb a { color: var(--color-accent); transition: opacity var(--transition-fast); }
.breadcrumb a:hover { opacity: 0.7; }
.separator { margin: 0 6px; }
.current { color: var(--color-text); }
.crumb-mid { color: var(--color-text); }
.sub-link { color: var(--color-text); }
.article { max-width: 800px; margin: 0 auto; }
.article-title { font-size: 24px; font-weight: 700; color: var(--color-text); margin-bottom: 12px; line-height: 1.4; }
.article-time { font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border); }
.article-content { font-size: 16px; line-height: 1.9; color: var(--color-text); }
.article-content :deep(h2) { font-size: 20px; margin: 24px 0 12px; }
.article-content :deep(p) { margin-bottom: 16px; }
.back-wrap { text-align: center; margin-top: 40px; }
.btn-back { padding: 10px 32px; border: 1px solid var(--color-accent); border-radius: var(--radius-sm); color: var(--color-accent); font-size: 14px; cursor: pointer; transition: all var(--transition-fast); font-family: inherit; min-height: 44px; }
.btn-back:hover { background: var(--color-accent); color: var(--color-on-accent); }
.loading { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
</style>
