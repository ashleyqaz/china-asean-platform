<template>
  <div class="support-section">
    <button class="support-title" @click="toggleExpand" :aria-expanded="expanded">
      热带农业政策、科技与产业支撑单位
    </button>

    <div class="support-subcategories" ref="subRef" :style="{ maxHeight: expanded ? subMaxHeight + 'px' : '0' }">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="subcategory-btn"
        @click="goToCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
const categories = ref([])
const expanded = ref(false)
const subRef = ref(null)
const subMaxHeight = ref(0)

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value) {
    nextTick(() => {
      if (subRef.value) {
        subMaxHeight.value = subRef.value.scrollHeight
      }
    })
  }
}

function goToCategory(categoryId) {
  navigateTo(`/units/${categoryId}`)
}

onMounted(async () => {
  try {
    const res = await $fetch('/api/unit-categories')
    if (res.code === 200) {
      categories.value = res.data
      // 预先计算最大高度
      if (subRef.value) {
        // 临时设为 auto 来获取高度
        subRef.value.style.maxHeight = 'none'
        subMaxHeight.value = subRef.value.scrollHeight
        subRef.value.style.maxHeight = '0'
      }
    }
  } catch (e) {
    console.error('Failed to load unit categories:', e)
  }
})
</script>

<style scoped>
.support-section {
  margin-top: 40px;
}

.support-title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  padding: 16px 20px;
  cursor: pointer;
  transition: color var(--transition-fast);
  min-height: 44px;
}

.support-title:hover {
  color: var(--color-accent);
}

.support-subcategories {
  overflow: hidden;
  transition: max-height 0.3s ease;
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.subcategory-btn {
  padding: 10px 24px;
  font-size: 15px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 44px;
  min-height: 44px;
}

.subcategory-btn:hover {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

@media (max-width: 767px) {
  .support-subcategories {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .subcategory-btn {
    width: 80%;
  }

  .support-title {
    font-size: 16px;
  }
}
</style>
