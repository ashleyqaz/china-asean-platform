<template>
  <div class="news-card">
    <div class="news-header">
      <span class="news-decor"></span>
      <h3 class="news-title">{{ t('news.title') }}</h3>
    </div>
    <div class="news-divider"></div>

    <div v-if="newsItems.length === 0" class="news-empty">{{ t('news.empty') }}</div>

    <ul v-else class="news-list">
      <li v-for="item in newsItems" :key="item.id" class="news-item" @click="goDetail(item.id)">
        <span class="news-dot"></span>
        <span class="news-item-title">{{ item.title }}</span>
        <span class="news-date">{{ formatDate(item.publishTime) }}</span>
      </li>
    </ul>

    <div class="news-divider"></div>
    <button v-if="hasMore" class="news-more-btn" @click="loadMore">{{ t('news.more') }} &gt;</button>
  </div>
</template>

<script setup>
const { t } = useI18n()
const newsItems = ref([])
const currentPage = ref(1)
const hasMore = ref(true)
const pageSize = 6

async function fetchNews(page = 1) {
  try {
    const res = await $fetch('/api/news', { params: { page, size: pageSize } })
    if (res.code === 200) {
      if (page === 1) newsItems.value = res.data.items
      else newsItems.value.push(...res.data.items)
      hasMore.value = newsItems.value.length < res.data.total
    }
  } catch (e) { console.error('Failed to load news:', e) }
}

function goDetail(id) {
  navigateTo(`/news/${id}`)
}

function loadMore() { currentPage.value++; fetchNews(currentPage.value) }

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

onMounted(() => fetchNews())
</script>

<style scoped>
.news-card {
  height: var(--carousel-height);
  background: #F7F7F7;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 16px;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 0 8px;
  flex-shrink: 0;
}

.news-decor {
  width: 3px;
  height: 18px;
  background: var(--color-accent);
  border-radius: 2px;
}

.news-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.news-divider { height: 1px; background: var(--color-border); flex-shrink: 0; }

.news-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.news-list { flex: 1; overflow-y: auto; padding: 4px 0; }

.news-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 4px;
  cursor: pointer;
  border-bottom: 1px dotted var(--color-border);
  transition: all var(--transition-fast);
  min-height: 44px;
}

.news-item:hover { background: var(--color-bg-light); }
.news-item:hover .news-item-title { color: var(--color-accent); }

.news-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

.news-item-title {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-date {
  font-size: 12px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.news-more-btn {
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
  min-height: 44px;
}
.news-more-btn:hover { opacity: 0.75; }

@media (max-width: 767px) {
  .news-card { height: auto; min-height: 300px; }
}
</style>
