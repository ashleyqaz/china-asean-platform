<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ t('projectsPage.title') }}</span></nav>
      <h1 class="page-title">{{ t('projectsPage.title') }}</h1>
      <div v-if="items.length" class="grid">
        <div v-for="p in items" :key="p.id" class="card" :class="{ featured: p.isFeatured }">
          <div class="card-img" :style="{ background: p.coverImage ? `url(${p.coverImage})` : 'var(--color-border)' }"></div>
          <div class="card-body">
            <h3>{{ p.name }}</h3>
            <p class="participants">{{ p.participants }}</p>
            <p class="period" v-if="p.startDate">{{ p.startDate }} ~ {{ p.endDate }}</p>
            <p class="desc">{{ p.description }}</p>
            <span v-if="p.isFeatured" class="featured-tag">重点推荐</span>
          </div>
        </div>
      </div>
      <div v-else class="empty">{{ t('projectsPage.noData') }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const items = ref([])
onMounted(async () => {
  try { const r = await $fetch('/api/projects'); if (r.code === 200) items.value = r.data } catch (e) {}
})
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('projectsPage.title')), description: computed(() => t('projectsPage.desc')) })
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
.card { background: var(--color-bg-card); border-radius: var(--radius-md); overflow: hidden; transition: box-shadow var(--transition-fast); }
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.card.featured { border: 2px solid var(--color-accent); }
.card-img { height: 180px; background-size: cover !important; background-position: center !important; }
.card-body { padding: 20px; }
.card-body h3 { font-size: 18px; margin-bottom: 8px; }
.participants { font-size: 13px; color: var(--color-accent); margin-bottom: 4px; }
.period { font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px; }
.desc { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; }
.featured-tag { display: inline-block; padding: 3px 10px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 20px; font-size: 12px; margin-top: 8px; }
.empty { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
@media (max-width: 767px) { .grid { grid-template-columns: 1fr; } }
</style>
