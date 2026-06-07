<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ t('expertsPage.title') }}</span></nav>
      <h1 class="page-title">{{ t('expertsPage.title') }}</h1>
      <div v-if="items.length" class="grid">
        <div v-for="e in items" :key="e.id" class="card">
          <div class="avatar">{{ e.name.charAt(0) }}</div>
          <h3>{{ e.name }}</h3>
          <p class="expert-title">{{ e.title }}</p>
          <p class="org">{{ e.organization }}</p>
          <span class="field">{{ e.field }}</span>
          <p class="bio">{{ e.bio }}</p>
        </div>
      </div>
      <div v-else class="empty">{{ t('expertsPage.noData') }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const items = ref([])
onMounted(async () => {
  try { const r = await $fetch('/api/experts'); if (r.code === 200) items.value = r.data } catch (e) {}
})
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('expertsPage.title')), description: computed(() => t('expertsPage.desc')) })
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.card { background: var(--color-bg-card); border-radius: var(--radius-md); padding: 24px; text-align: center; transition: box-shadow var(--transition-fast); }
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--color-accent); color: var(--color-on-accent); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; margin: 0 auto 12px; }
.card h3 { font-size: 18px; margin-bottom: 4px; }
.expert-title { font-size: 14px; color: var(--color-accent); margin-bottom: 4px; }
.org { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 6px; }
.field { display: inline-block; padding: 2px 10px; background: var(--color-bg-light); border-radius: 20px; font-size: 12px; color: var(--color-text-secondary); margin-bottom: 8px; }
.bio { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; }
.empty { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
</style>
