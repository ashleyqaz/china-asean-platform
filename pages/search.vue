<template>
  <div class="page">
    <div class="container">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索资讯、政策、技术..." @keyup.enter="search">
        <button class="search-btn" @click="search">搜索</button>
      </div>
      <div v-if="searched">
        <p class="result-info">找到 {{ total }} 条相关结果</p>
        <div v-if="items.length" class="results">
          <div v-for="item in items" :key="item.id" class="result-item">
            <NuxtLink :to="`/news/${item.id}`">
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary || '' }}</p>
            </NuxtLink>
          </div>
        </div>
        <div v-else class="empty">未找到相关结果</div>
        <div v-if="total > size" class="pager">
          <button :disabled="page <= 1" @click="page--; search()">上一页</button>
          <span>{{ page }}/{{ Math.ceil(total / size) }}</span>
          <button :disabled="page >= Math.ceil(total / size)" @click="page++; search()">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const keyword = ref(route.query.q || '')
const items = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const searched = ref(false)

async function search() {
  if (!keyword.value.trim()) return
  try {
    const r = await $fetch('/api/search', { params: { q: keyword.value, page: page.value, size: size.value } })
    if (r.code === 200) { items.value = r.data.items; total.value = r.data.total; searched.value = true }
  } catch (e) {}
}

onMounted(() => { if (keyword.value) search() })
definePageMeta({ layout: 'default' })
usePageSeo({ title: '搜索', description: '搜索平台资讯内容' })
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.search-bar { display: flex; gap: 12px; max-width: 640px; margin: 0 auto 24px; }
.search-input { flex: 1; padding: 12px 16px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); font-size: 16px; outline: none; transition: border-color var(--transition-fast); }
.search-input:focus { border-color: var(--color-accent); }
.search-btn { padding: 12px 28px; background: var(--color-accent); color: var(--color-on-accent); border-radius: var(--radius-sm); font-size: 15px; cursor: pointer; min-height: 48px; }
.search-btn:hover { opacity: 0.9; }
.result-info { font-size: 14px; color: var(--color-text-muted); margin-bottom: 16px; }
.results { max-width: 800px; }
.result-item { padding: 16px 0; border-bottom: 1px solid var(--color-border); }
.result-item h3 { font-size: 16px; margin-bottom: 4px; transition: color var(--transition-fast); }
.result-item:hover h3 { color: var(--color-accent); }
.result-item p { font-size: 13px; color: var(--color-text-secondary); }
.empty { text-align: center; color: var(--color-text-muted); padding: 80px 0; }
.pager { display: flex; justify-content: center; gap: 16px; align-items: center; margin-top: 24px; }
.pager button { padding: 8px 16px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer; font-size: 14px; min-height: 44px; }
.pager button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
