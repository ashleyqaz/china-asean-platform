<template>
  <div class="carousel-card">
    <div class="carousel" ref="carouselRef">
      <div v-if="items.length === 0" class="carousel-placeholder">
        这里放几张滚动播放的图片
      </div>
      <template v-else>
        <div class="carousel-viewport" @touchstart="onTouchStart" @touchend="onTouchEnd">
          <Transition name="carousel-fade" mode="out-in">
            <a
              :key="currentIndex"
              class="carousel-slide"
              :href="currentItem.link_url || undefined"
              :target="currentItem.link_url ? '_blank' : undefined"
            >
              <img :src="currentItem.imageUrl" :alt="currentItem.title" class="carousel-img">
            </a>
          </Transition>
        </div>

        <button class="carousel-arrow carousel-arrow-left" @click="prev" @mouseenter="pauseAuto" @mouseleave="resumeAuto">‹</button>
        <button class="carousel-arrow carousel-arrow-right" @click="next" @mouseenter="pauseAuto" @mouseleave="resumeAuto">›</button>

        <div class="carousel-dots">
          <button
            v-for="(item, idx) in items"
            :key="idx"
            class="carousel-dot"
            :class="{ active: idx === currentIndex }"
            @click="goTo(idx)"
          />
        </div>
      </template>
    </div>
    <!-- 图注 -->
    <p v-if="displayCaption" class="carousel-caption">{{ displayCaption }}</p>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({ items: { type: Array, default: () => [] } })

const currentIndex = ref(0)
const autoTimer = ref(null)
const carouselRef = ref(null)
let touchStartX = 0

const currentItem = computed(() => props.items[currentIndex.value] || {})
const displayCaption = computed(() => {
  const item = currentItem.value
  // 优先使用翻译的caption
  const translatedKey = `carousel.caption${item.sortOrder || 1}`
  const translated = t(translatedKey)
  return translated !== translatedKey ? translated : item.caption
})

function next() { currentIndex.value = (currentIndex.value + 1) % props.items.length }
function prev() { currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length }
function goTo(idx) { currentIndex.value = idx; startAuto() }
function startAuto() { stopAuto(); if (props.items.length > 1) autoTimer.value = setInterval(next, 5000) }
function stopAuto() { if (autoTimer.value) { clearInterval(autoTimer.value); autoTimer.value = null } }
function pauseAuto() { stopAuto() }
function resumeAuto() { startAuto() }
function onTouchStart(e) { touchStartX = e.touches[0].clientX; pauseAuto() }
function onTouchEnd(e) {
  resumeAuto()
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) { if (dx > 0) prev(); else next() }
}

watch(() => props.items, () => { currentIndex.value = 0; startAuto() }, { immediate: true })
onMounted(() => startAuto())
onUnmounted(() => stopAuto())
</script>

<style scoped>
.carousel-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 100%;
  height: var(--carousel-height);
  background: var(--color-bg-light);
}

.carousel-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 18px;
}

.carousel-viewport { width: 100%; height: 100%; }
.carousel-slide { display: block; width: 100%; height: 100%; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; }

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
  z-index: 2;
}
.carousel-arrow:hover { background: rgba(0,0,0,0.55); }
.carousel-arrow-left { left: 12px; }
.carousel-arrow-right { right: 12px; }

.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}
.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.7);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all var(--transition-fast);
}
.carousel-dot.active { background: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.9); }

/* 图注 */
.carousel-caption {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 12px 16px;
  background: var(--color-bg-card);
}

.carousel-fade-enter-active,
.carousel-fade-leave-active { transition: opacity 0.4s ease; }
.carousel-fade-enter-from,
.carousel-fade-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .carousel { height: auto; }
  .carousel-viewport { position: relative; padding-bottom: 62.5%; }
  .carousel-slide { position: absolute; inset: 0; }
  .carousel-arrow { width: 36px; height: 36px; font-size: 20px; }
}
</style>
