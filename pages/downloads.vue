<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ t('downloadsPage.title') }}</span></nav>
      <h1 class="page-title">{{ t('downloadsPage.title') }}</h1>
      <div class="filters">
        <button v-for="cat in cats" :key="cat.key" class="filter-btn" :class="{ active: activeCat === cat.key }" @click="activeCat = activeCat === cat.key ? '' : cat.key; load()">{{ cat.label }}</button>
      </div>
      <div v-if="items.length" class="list">
        <div v-for="d in items" :key="d.id" class="item">
          <div class="item-info">
            <h3>{{ d.title }}</h3>
            <p>{{ d.description }}</p>
            <span class="meta">{{ d.fileSize }} · {{ t('downloadsPage.download') }} {{ d.downloadCount }} 次</span>
          </div>
          <button class="dl-btn" @click="download(d)">{{ t('downloadsPage.download') }}</button>
        </div>
      </div>
      <div v-else class="empty">{{ t('downloadsPage.noData') }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const cats = computed(() => [
  { key: '', label: t('downloadsPage.all') },
  { key: '政策文件', label: t('downloadsPage.policy') },
  { key: '技术标准', label: t('downloadsPage.standard') },
  { key: '研究报告', label: t('downloadsPage.research') },
  { key: '培训教材', label: t('downloadsPage.training') }
])
const activeCat = ref('')
const items = ref([])
async function load() {
  try {
    const params = activeCat.value ? { category: activeCat.value } : {}
    const r = await $fetch('/api/downloads', { params })
    if (r.code === 200) items.value = r.data
  } catch (e) {}
}
function download(d) { window.open(d.fileUrl, '_blank') }
onMounted(load)
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('downloadsPage.title')), description: computed(() => t('downloadsPage.desc')) })
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 28px; }
.filters { display: flex; justify-content: center; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
.filter-btn { padding: 8px 20px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 14px; cursor: pointer; transition: all var(--transition-fast); background: var(--color-bg); }
.filter-btn.active { background: var(--color-accent); color: var(--color-on-accent); border-color: var(--color-accent); }
.filter-btn:hover:not(.active) { border-color: var(--color-accent); color: var(--color-accent); }
.list { max-width: 800px; margin: 0 auto; }
.item { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--color-bg-card); border-radius: var(--radius-md); margin-bottom: 12px; }
.item-info { flex: 1; }
.item-info h3 { font-size: 16px; margin-bottom: 4px; }
.item-info p { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px; }
.meta { font-size: 12px; color: var(--color-text-muted); }
.dl-btn { padding: 8px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: var(--radius-sm); cursor: pointer; font-size: 14px; white-space: nowrap; min-height: 44px; }
.dl-btn:hover { opacity: 0.9; }
.empty { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
@media (max-width: 767px) { .item { flex-direction: column; align-items: flex-start; } .dl-btn { width: 100%; text-align: center; } }
</style>
