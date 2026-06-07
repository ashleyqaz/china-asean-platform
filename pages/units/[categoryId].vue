<template>
  <div class="units-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>
      <h1 class="page-title">{{ categoryName }}</h1>

      <div v-if="units.length === 0" class="empty-hint">暂无单位信息</div>

      <ul v-else class="units-list">
        <li v-for="unit in units" :key="unit.id" class="unit-item">
          <img v-if="unit.logo_url" :src="unit.logo_url" :alt="unit.name" class="unit-logo">
          <div class="unit-info">
            <span class="unit-name">{{ unit.name }}</span>
            <a v-if="unit.website_url" :href="unit.website_url" target="_blank" class="unit-website">
              访问官网 →
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const categoryName = ref('')
const units = ref([])

onMounted(async () => {
  try {
    const [catRes, unitsRes] = await Promise.all([
      $fetch('/api/unit-categories'),
      $fetch('/api/support-units', { params: { categoryId: route.params.categoryId } })
    ])

    if (catRes.code === 200) {
      const cat = catRes.data.find(c => c.id === parseInt(route.params.categoryId))
      if (cat) categoryName.value = cat.name
    }

    if (unitsRes.code === 200) units.value = unitsRes.data
  } catch (e) {
    console.error('Failed to load units:', e)
  }
})

definePageMeta({ layout: 'default' })

usePageSeo({
  title: computed(() => `${categoryName.value} - 支撑单位`),
  description: computed(() => `查看${categoryName.value}分类下的热带农业政策、科技与产业支撑单位名录。`)
})
</script>

<style scoped>
.units-page {
  padding-top: 40px;
  min-height: 50vh;
}

.back-link {
  font-size: 14px;
  color: var(--color-accent);
  display: inline-block;
  margin-bottom: 20px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.back-link:hover {
  opacity: 0.7;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 32px;
}

.empty-hint {
  text-align: center;
  color: var(--color-text-muted);
  padding: 40px;
}

.units-list {
  max-width: 800px;
  margin: 0 auto;
}

.unit-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.unit-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.unit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.unit-name {
  font-size: 15px;
  color: var(--color-text);
}

.unit-website {
  font-size: 13px;
  color: var(--color-accent);
}

.unit-website:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .units-page {
    padding: 20px 16px;
  }
}
</style>
