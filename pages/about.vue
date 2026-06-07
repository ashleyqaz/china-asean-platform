<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ t('aboutPage.title') }}</span></nav>
      <h1 class="page-title">{{ t('aboutPage.title') }}</h1>
      <div v-if="content" class="content" v-html="content"></div>
      <div v-else class="loading">{{ t('common.loading') }}</div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const content = ref('')
onMounted(async () => { try { const r = await $fetch('/api/about'); if (r.code === 200) content.value = r.data.content } catch (e) {} })
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('aboutPage.title')), description: computed(() => t('aboutPage.desc')) })
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
.content { max-width: 800px; margin: 0 auto; font-size: 16px; line-height: 1.9; }
.content :deep(h2) { font-size: 20px; margin: 28px 0 12px; }
.content :deep(p) { margin-bottom: 14px; }
.loading { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
</style>
