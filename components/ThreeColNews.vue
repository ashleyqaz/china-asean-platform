<template>
  <div class="three-col-news">
    <div class="container">
      <div class="cols-grid">
        <!-- 左栏：农业应对气候变化 -->
        <div class="col">
          <h3 class="col-title">{{ t('threeCol.left') }}</h3>
          <div class="col-divider"></div>
          <div class="col-body">
            <!-- 大图 -->
            <NuxtLink v-if="leftCol[0]" :to="`/news/${leftCol[0].id}`" class="featured-img-wrap">
              <img :src="leftCol[0].coverImage || '/images/news-placeholder.svg'" :alt="leftCol[0].title" class="featured-img">
            </NuxtLink>
            <div v-else class="featured-img-wrap empty-img">{{ t('common.noData') }}</div>
            <!-- 头条标题 -->
            <NuxtLink v-if="leftCol[0]" :to="`/news/${leftCol[0].id}`" class="featured-title">
              {{ leftCol[0].title }}
            </NuxtLink>
            <!-- 圆点列表 -->
            <ul class="dot-list">
              <li v-for="item in leftColRest" :key="item.id" class="dot-item">
                <span class="dot"></span>
                <NuxtLink :to="`/news/${item.id}`" class="dot-link">{{ item.title }}</NuxtLink>
              </li>
              <li v-if="leftCol.length === 0" class="dot-item empty">{{ t('categoryPage.noNews') }}</li>
            </ul>
          </div>
        </div>

        <!-- 中栏：绿色低碳农业 -->
        <div class="col">
          <h3 class="col-title">{{ t('threeCol.mid') }}</h3>
          <div class="col-divider"></div>
          <div class="col-body">
            <NuxtLink v-if="midCol[0]" :to="`/news/${midCol[0].id}`" class="featured-img-wrap">
              <img :src="midCol[0].coverImage || '/images/news-placeholder.svg'" :alt="midCol[0].title" class="featured-img">
            </NuxtLink>
            <div v-else class="featured-img-wrap empty-img">{{ t('common.noData') }}</div>
            <NuxtLink v-if="midCol[0]" :to="`/news/${midCol[0].id}`" class="featured-title">
              {{ midCol[0].title }}
            </NuxtLink>
            <ul class="dot-list">
              <li v-for="item in midColRest" :key="item.id" class="dot-item">
                <span class="dot"></span>
                <NuxtLink :to="`/news/${item.id}`" class="dot-link">{{ item.title }}</NuxtLink>
              </li>
              <li v-if="midCol.length === 0" class="dot-item empty">{{ t('categoryPage.noNews') }}</li>
            </ul>
          </div>
        </div>

        <!-- 右栏：东盟国际合作动态 -->
        <div class="col">
          <h3 class="col-title">{{ t('threeCol.right') }}</h3>
          <div class="col-divider"></div>
          <div class="col-body">
            <NuxtLink v-if="rightCol[0]" :to="`/news/${rightCol[0].id}`" class="featured-img-wrap">
              <img :src="rightCol[0].coverImage || '/images/news-placeholder.svg'" :alt="rightCol[0].title" class="featured-img">
            </NuxtLink>
            <div v-else class="featured-img-wrap empty-img">{{ t('common.noData') }}</div>
            <NuxtLink v-if="rightCol[0]" :to="`/news/${rightCol[0].id}`" class="featured-title">
              {{ rightCol[0].title }}
            </NuxtLink>
            <ul class="dot-list">
              <li v-for="item in rightColRest" :key="item.id" class="dot-item">
                <span class="dot"></span>
                <NuxtLink :to="`/news/${item.id}`" class="dot-link">{{ item.title }}</NuxtLink>
              </li>
              <li v-if="rightCol.length === 0" class="dot-item empty">{{ t('categoryPage.noNews') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const leftCol = ref([])
const midCol = ref([])
const rightCol = ref([])

const leftColRest = computed(() => leftCol.value.slice(1, 5))
const midColRest = computed(() => midCol.value.slice(1, 5))
const rightColRest = computed(() => rightCol.value.slice(1, 5))

onMounted(async () => {
  try {
    const [leftRes, midRes, rightRes] = await Promise.all([
      $fetch('/api/news', { params: { categorySlug: 'agriculture-climate-response', size: 5 } }),
      $fetch('/api/news', { params: { categorySlug: 'green-low-carbon-agriculture', size: 5 } }),
      $fetch('/api/news', { params: { categorySlug: 'tech-exchange-interaction,international-org-updates', size: 5 } })
    ])
    if (leftRes.code === 200) leftCol.value = leftRes.data.items
    if (midRes.code === 200) midCol.value = midRes.data.items
    if (rightRes.code === 200) rightCol.value = rightRes.data.items
  } catch (e) {
    console.error('Failed to load three-col news:', e)
  }
})
</script>

<style scoped>
.three-col-news {
  padding: 36px 0 10px;
  background: #ffffff;
}

.cols-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 28px;
}

.col {
  min-width: 0;
}

.col-title {
  font-size: 17px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 0;
  text-align: center;
}

.col-divider {
  height: 2px;
  background: #82B960;
  margin: 10px 0 16px;
}

.col-body {
  display: flex;
  flex-direction: column;
}

/* 大图 */
.featured-img-wrap {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 6px;
  background: #f3f3f3;
  margin-bottom: 10px;
}

.featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-img-wrap:hover .featured-img {
  transform: scale(1.04);
}

.empty-img {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

/* 头条标题 */
.featured-title {
  font-size: 15px;
  font-weight: 700;
  color: #333333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
  margin-bottom: 12px;
  text-decoration: none;
}

.featured-title:hover {
  color: #82B960;
}

/* 圆点列表 */
.dot-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dot-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.dot-item.empty {
  color: #999;
  font-size: 13px;
  padding-left: 16px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #82B960;
  flex-shrink: 0;
  margin-top: 7px;
}

.dot-link {
  font-size: 13px;
  color: #555555;
  line-height: 1.5;
  transition: color var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
}

.dot-link:hover {
  color: #82B960;
}

/* 移动端堆叠 */
@media (max-width: 767px) {
  .cols-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .col-title {
    text-align: center;
  }

  .three-col-news {
    padding: 24px 0 0;
  }
}
</style>
