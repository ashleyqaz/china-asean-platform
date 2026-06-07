<template>
  <header class="header">
    <!-- 标题栏 — 深色背景 -->
    <div class="title-bar">
      <div class="title-bar-inner">
        <span v-if="headerNote" class="note-text">{{ headerNote }}</span>
        <span v-else class="note-placeholder"></span>
        <h1 class="main-title">{{ t('siteTitle') }}</h1>
        <div class="header-right">
          <div class="lang-switch">
            <button
              v-for="loc in displayLocales"
              :key="loc"
              class="lang-btn"
              :class="{ active: locale === loc }"
              @click="setLocale(loc)"
            >{{ localeNames[loc] }}</button>
          </div>
          <div class="search-wrap">
            <input
              v-if="showSearch"
              ref="searchInput"
              v-model="searchKey"
              class="search-input"
              placeholder="搜索..."
              @keyup.enter="doSearch"
              @blur="showSearch = false">
            <button class="search-btn" @click="toggleSearch" title="搜索">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
          <button class="qrcode-btn" @click="showQrcode = true" :title="t('publicAccount')">
            <img :src="qrcodeUrl" alt="微信公众号二维码" class="qrcode-thumb">
            <span class="qrcode-label">{{ t('publicAccount') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 导航栏 — 两行4列，与标题同色背景 -->
    <nav class="nav-bar">
      <div class="nav-inner">
        <template v-for="(item, index) in navMenus" :key="item.id">
          <NuxtLink
            :to="`/category/${item.slug}`"
            class="nav-item"
          >
            {{ tNav(item.sortOrder) || item.name }}
          </NuxtLink>
        </template>
      </div>
    </nav>

    <QrcodeModal :visible="showQrcode" :image-url="qrcodeUrl" @close="showQrcode = false" />
  </header>
</template>

<script setup>
import QrcodeModal from './QrcodeModal.vue'

const { locale, locales, localeNames, setLocale, t } = useI18n()
const displayLocales = computed(() => locales)

const showQrcode = ref(false)
const showSearch = ref(false)
const searchKey = ref('')
const searchInput = ref(null)
const navMenus = ref([])
const headerNote = ref('')
const qrcodeUrl = ref('/images/qrcode-placeholder.svg')

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (showSearch.value) nextTick(() => searchInput.value?.focus())
}
function doSearch() {
  if (searchKey.value.trim()) navigateTo(`/search?q=${encodeURIComponent(searchKey.value.trim())}`)
  showSearch.value = false; searchKey.value = ''
}

function tNav(order) {
  return t(`nav.${order}`)
}

onMounted(async () => {
  try {
    const [menuRes, qrcodeRes, contactRes] = await Promise.all([
      $fetch('/api/nav-menus'),
      $fetch('/api/qrcode'),
      $fetch('/api/contact-info')
    ])
    if (menuRes.code === 200) navMenus.value = menuRes.data
    if (qrcodeRes.code === 200 && qrcodeRes.data.imageUrl) qrcodeUrl.value = qrcodeRes.data.imageUrl
    if (contactRes.code === 200) headerNote.value = contactRes.data.header_note || ''
  } catch (e) {
    console.error('Failed to load header data:', e)
  }
})
</script>

<style scoped>
.header {
  background: #ffffff;
  border-top: 1px solid #ffffff;
}

/* 标题栏 */
.title-bar {
  padding: 18px 0 30px;
  border-bottom: 1px solid #82B960;
}

.title-bar-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  min-height: 60px;
}

.note-text {
  position: absolute;
  left: 20px;
  font-size: 12px;
  color: rgba(0,0,0,0.5);
}

.note-placeholder {
  position: absolute;
  left: 20px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  text-align: left;
  letter-spacing: 1px;
  padding-right: 280px;
}

/* 右侧区域：语言切换 + 二维码 */
.header-right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-switch {
  display: flex;
  gap: 0;
}

.lang-btn {
  padding: 3px 8px;
  font-size: 12px;
  color: rgba(0,0,0,0.55);
  border: none;
  background: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  border-right: 1px solid rgba(0,0,0,0.12);
  line-height: 1.4;
}

.lang-btn:last-child {
  border-right: none;
}

.lang-btn:hover {
  color: #000000;
}

.lang-btn.active {
  color: #000000;
  font-weight: 600;
}

/* 搜索 */
.search-wrap { display: flex; align-items: center; }
.search-btn {
  color: rgba(0,0,0,0.55); cursor: pointer; transition: color var(--transition-fast);
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
}
.search-btn:hover { color: #000000; }
.search-input {
  width: 160px; padding: 6px 10px; border: 1px solid rgba(0,0,0,0.2);
  border-radius: var(--radius-sm); background: rgba(0,0,0,0.04); color: #000000;
  font-size: 13px; outline: none;
}
.search-input::placeholder { color: rgba(0,0,0,0.35); }
.search-input:focus { border-color: rgba(0,0,0,0.4); }

.qrcode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color var(--transition-fast);
  min-width: 82px;
  min-height: 82px;
}

.qrcode-btn:hover {
  border-color: var(--color-accent);
}

.qrcode-thumb {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

.qrcode-label {
  font-size: 10px;
  color: rgba(0,0,0,0.5);
}

/* 导航栏 — 与标题同色背景，底部粗绿线 */
.nav-bar {
  border-bottom: 3px solid #82B960;
}

.nav-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 28px 20px 22px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px 0;
}

.nav-item {
  padding: 10px 16px;
  font-size: 15px;
  color: rgba(0,0,0,0.75);
  transition: all var(--transition-fast);
  white-space: nowrap;
  text-decoration: none;
}

/* 悬停：加粗，无下划线 */
.nav-item:hover {
  color: #000000;
  font-weight: 700;
}

/* 路由激活：加粗 */
.nav-item.router-link-active {
  color: #000000;
  font-weight: 700;
}


/* 移动端 */
@media (max-width: 767px) {
  .main-title {
    font-size: 18px;
    padding: 0 10px 50px;
  }

  .header-right {
    position: absolute;
    right: 8px;
    bottom: 8px;
    top: auto;
    transform: none;
    gap: 8px;
  }

  .lang-btn {
    font-size: 10px;
    padding: 2px 4px;
  }

  .qrcode-btn {
    min-width: 60px;
    min-height: 60px;
  }
  .qrcode-thumb {
    width: 40px;
    height: 40px;
  }

  .nav-inner {
    grid-template-columns: 1fr;
    padding: 4px 16px 8px;
  }

  .nav-item {
    text-align: center;
    padding: 12px 8px;
  }

  .note-text {
    display: none;
  }
}
</style>
