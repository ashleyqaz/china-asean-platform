<template>
  <div class="category-page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ menuName }}</span></nav>

      <div class="cat-layout">
        <!-- 左侧侧边栏 -->
        <aside class="cat-sidebar">
          <div class="side-module">
            <h3 class="side-module-title">{{ t('sidebar.subCategories') }}</h3>
            <div class="sub-menu-list">
              <button v-for="sub in subCategories" :key="sub.id" class="sub-menu-btn" :class="{ active: activeSub === sub.id }" @click="activeSub = sub.id">
                {{ sub.name }}<span class="arrow">→</span>
              </button>
              <button v-if="subCategories.length === 0" class="sub-menu-btn" disabled>{{ t('common.noSubCategories') }}</button>
            </div>
          </div>

          <div class="side-module">
            <h3 class="side-module-title">{{ t('sidebar.importantNews') }}</h3>
            <ul class="side-news-list">
              <li v-for="item in topNews" :key="item.id" class="side-news-item">
                <span class="dot"></span><NuxtLink :to="`/news/${item.id}`" class="side-news-link">{{ item.title }}</NuxtLink>
              </li>
              <li v-if="topNews.length === 0" class="side-empty">{{ t('common.noData') }}</li>
            </ul>
          </div>

          <div class="side-module">
            <h3 class="side-module-title">{{ t('sidebar.hotTopics') }}</h3>
            <div class="hot-list">
              <div v-for="item in hotNews" :key="item.id" class="hot-item">
                <div class="hot-img" :style="item.coverImage ? { backgroundImage: `url(${item.coverImage})` } : {}"></div>
                <NuxtLink :to="`/news/${item.id}`" class="hot-link">{{ item.title }}</NuxtLink>
              </div>
              <div v-if="hotNews.length === 0" class="side-empty">{{ t('common.noData') }}</div>
            </div>
          </div>
        </aside>

        <!-- 右侧主内容 -->
        <div class="cat-main">
          <section v-for="section in sections" :key="section.name" class="content-section">
            <div class="section-header">
              <h2 class="section-title">{{ section.name }}</h2>
              <NuxtLink :to="`/search?q=${encodeURIComponent(section.name)}`" class="section-more">{{ t('common.more') }} &gt;</NuxtLink>
            </div>
            <ul v-if="section.items.length" class="section-list">
              <li v-for="item in section.items" :key="item.id" class="section-row">
                <span class="row-dot"></span>
                <NuxtLink :to="`/news/${item.id}`" class="row-link">{{ item.title }}</NuxtLink>
                <span class="row-date">{{ formatDate(item.publishTime) }}</span>
              </li>
            </ul>
            <p v-else class="section-empty">{{ t('common.noData') }}</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute()
const menuName = ref('')
const subCategories = ref([])
const activeSub = ref(null)
const allNews = ref([])
const topNews = ref([])
const hotNews = ref([])

const sections = computed(() => {
  const groups = {}
  for (const sub of subCategories.value) groups[sub.name] = []
  if (subCategories.value.length === 0) {
    groups['栽培技术'] = []; groups['智能灌溉'] = []; groups['土壤管理'] = []; groups['病虫害防控'] = []; groups['典型经验'] = []
  }
  for (const item of allNews.value) {
    let matched = false
    for (const name of Object.keys(groups)) {
      if (item.title.includes(name) || item.title.includes(name.slice(0, 2))) { groups[name].push(item); matched = true; break }
    }
    if (!matched) { const keys = Object.keys(groups); if (keys.length) groups[keys[0]].push(item) }
  }
  return Object.entries(groups).map(([name, items]) => ({ name, items: items.slice(0, 5) }))
})

async function loadData() {
  try {
    const [menuRes, subRes, newsRes] = await Promise.all([
      $fetch('/api/nav-menus'), $fetch('/api/sub-categories', { params: { menuSlug: route.params.slug } }),
      $fetch('/api/news', { params: { page: 1, size: 50 } })
    ])
    if (menuRes.code === 200) { const m = menuRes.data.find(x => x.slug === route.params.slug); if (m) menuName.value = m.name }
    if (subRes.code === 200) { subCategories.value = subRes.data; const qid = route.query.subId ? Number(route.query.subId) : null; activeSub.value = (qid && subRes.data.find(s => s.id === qid)) ? qid : (subRes.data[0]?.id ?? null) }
    if (newsRes.code === 200) { allNews.value = newsRes.data.items; topNews.value = newsRes.data.items.slice(0, 5); hotNews.value = newsRes.data.items.slice(0, 3) }
  } catch (e) { console.error(e) }
}

function formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}` }
onMounted(loadData)
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => menuName.value), description: computed(() => `${menuName.value} — ${t('breadcrumb.detail')}`) })
</script>

<style scoped>
.category-page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.cat-layout { display: flex; gap: 24px; align-items: flex-start; }
.cat-sidebar { width: 240px; flex-shrink: 0; }
.side-module { background: var(--color-bg-card); border-radius: var(--radius-md); margin-bottom: 16px; overflow: hidden; }
.side-module-title { font-size: 16px; font-weight: 700; color: var(--color-accent); padding: 12px 16px; border-bottom: 1px solid var(--color-border); }
.sub-menu-list { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.sub-menu-btn { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 14px; background: var(--color-bg-light); border: none; border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text); cursor: pointer; transition: all var(--transition-fast); font-family: inherit; text-align: left; }
.sub-menu-btn:hover { background: var(--color-accent-light); }
.sub-menu-btn.active { background: var(--color-accent); color: var(--color-on-accent); }
.sub-menu-btn.active .arrow { color: var(--color-on-accent); }
.sub-menu-btn:disabled { opacity: 0.5; cursor: default; }
.arrow { color: var(--color-text-muted); font-size: 12px; }
.side-news-list { padding: 8px 12px; }
.side-news-item { display: flex; align-items: flex-start; gap: 6px; padding: 6px 0; border-bottom: 1px dotted var(--color-border); }
.side-news-item:last-child { border-bottom: none; }
.dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-accent); margin-top: 7px; flex-shrink: 0; }
.side-news-link { font-size: 13px; color: var(--color-text); line-height: 1.5; transition: color var(--transition-fast); }
.side-news-link:hover { color: var(--color-accent); }
.hot-list { padding: 8px 12px; }
.hot-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px dotted var(--color-border); align-items: center; }
.hot-item:last-child { border-bottom: none; }
.hot-img { width: 60px; height: 45px; border-radius: var(--radius-sm); background: var(--color-border); background-size: cover; background-position: center; flex-shrink: 0; }
.hot-link { font-size: 13px; color: var(--color-text); line-height: 1.4; flex: 1; transition: color var(--transition-fast); }
.hot-link:hover { color: var(--color-accent); }
.side-empty { padding: 16px; font-size: 13px; color: var(--color-text-muted); text-align: center; }
.cat-main { flex: 1; min-width: 0; }
.content-section { margin-bottom: 28px; }
.section-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 2px solid var(--color-accent); margin-bottom: 12px; }
.section-title { font-size: 18px; font-weight: 700; color: var(--color-accent); }
.section-more { font-size: 13px; color: var(--color-text-muted); transition: color var(--transition-fast); }
.section-more:hover { color: var(--color-accent); }
.section-list { display: flex; flex-direction: column; }
.section-row { display: flex; align-items: center; gap: 10px; padding: 10px 4px; border-bottom: 1px solid var(--color-border); min-height: 44px; }
.section-row:last-child { border-bottom: none; }
.row-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-accent); flex-shrink: 0; }
.row-link { flex: 1; font-size: 14px; color: var(--color-text); transition: color var(--transition-fast); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-link:hover { color: var(--color-accent); }
.row-date { font-size: 12px; color: var(--color-text-muted); white-space: nowrap; flex-shrink: 0; }
.section-empty { font-size: 13px; color: var(--color-text-muted); padding: 20px 0; text-align: center; }
@media (max-width: 767px) { .cat-layout { flex-direction: column; } .cat-sidebar { width: 100%; } .section-row { flex-wrap: wrap; } .row-date { width: 100%; text-align: right; } }
</style>
