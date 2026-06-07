<template>
  <div class="home-page">
    <div class="container">
      <section class="main-section">
        <div class="carousel-col">
          <CarouselBanner :items="carouselItems" />
        </div>
        <div class="news-col">
          <NewsList />
        </div>
      </section>

      <!-- 三栏资讯模块 -->
      <ThreeColNews />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const carouselItems = ref([])

onMounted(async () => {
  try {
    const res = await $fetch('/api/carousel-items')
    if (res.code === 200) carouselItems.value = res.data
  } catch (e) { console.error(e) }
})

definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('siteTitle')), description: '中国—东盟气候智慧型热带农业协同平台，推动气候智慧型热带农业技术交流与合作。' })
useJsonLd('WebSite', { name: '中国—东盟气候智慧型热带农业协同平台', url: '' })
</script>

<style scoped>
.main-section {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  align-items: stretch;
}
.carousel-col { flex: 0 0 var(--carousel-width); max-width: var(--carousel-width); }
.news-col { flex: 1; min-width: 0; }

@media (max-width: 767px) {
  .main-section { flex-direction: column; gap: 20px; margin-top: 16px; }
  .carousel-col { flex: none; max-width: 100%; }
}
</style>
