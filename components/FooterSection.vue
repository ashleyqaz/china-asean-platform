<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <!-- 热带农业政策、科技与产业支撑单位 -->
      <div class="footer-col footer-links">
        <h4 class="footer-heading">{{ t('footer.links') }}</h4>
        <div class="link-categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="link-cat-btn"
            :class="{ active: activeCat === cat.id }"
            @click="activeCat === cat.id ? (activeCat = null) : (activeCat = cat.id); loadUnits(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
        <div v-if="activeCat" class="link-units" ref="unitsRef" :style="{ maxHeight: unitsExpanded ? unitsMaxHeight + 'px' : '0' }">
          <a
            v-for="unit in activeUnits"
            :key="unit.id"
            :href="unit.websiteUrl || '#'"
            :target="unit.websiteUrl ? '_blank' : undefined"
            class="link-unit-item"
          >
            {{ unit.name }}
          </a>
          <p v-if="activeUnits.length === 0" class="link-empty">暂无单位</p>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="footer-col footer-contact">
        <div class="footer-heading-row">
          <span class="footer-decor"></span>
          <h4 class="footer-heading">
            <NuxtLink to="/message" class="contact-link">{{ t('footer.contact') }}</NuxtLink>
          </h4>
        </div>
        <ul class="contact-list">
          <li v-if="contact.address">{{ t('footer.address') }}：{{ contact.address }}</li>
          <li v-if="contact.phone">{{ t('footer.phone') }}：{{ contact.phone }}</li>
          <li v-if="contact.email">{{ t('footer.email') }}：{{ contact.email }}</li>
        </ul>
      </div>

      <!-- 版权信息 -->
      <div class="footer-copyright">
        <p>{{ t('footer.copyright') }} &copy; {{ new Date().getFullYear() }} {{ siteName }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { t } = useI18n()
const categories = ref([])
const activeCat = ref(null)
const activeUnits = ref([])
const unitsExpanded = ref(false)
const unitsMaxHeight = ref(300)
const unitsRef = ref(null)

const contact = reactive({ address: '', phone: '', email: '', fax: '' })
const siteName = ref('中国—东盟气候智慧型热带农业协同平台')
const icpNumber = ref('')
async function loadUnits(catId) {
  try {
    const res = await $fetch('/api/support-units', { params: { categoryId: catId } })
    if (res.code === 200) {
      activeUnits.value = res.data
      unitsExpanded.value = true
      nextTick(() => {
        if (unitsRef.value) unitsMaxHeight.value = unitsRef.value.scrollHeight
      })
    }
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  try {
    const [catRes, contactRes, configRes] = await Promise.all([
      $fetch('/api/unit-categories'),
      $fetch('/api/contact-info'),
      $fetch('/api/site-config')
    ])
    if (catRes.code === 200) categories.value = catRes.data
    if (contactRes.code === 200) {
      contact.address = contactRes.data.address || ''
      contact.phone = contactRes.data.phone || ''
      contact.email = contactRes.data.email || ''
      contact.fax = contactRes.data.fax || ''
    }
    if (configRes.code === 200 && configRes.data) {
      if (configRes.data.siteName) siteName.value = configRes.data.siteName
      if (configRes.data.icpNumber) icpNumber.value = configRes.data.icpNumber
    }
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.site-footer {
  background: #F8F8F8;
  color: #333333;
  margin-top: 60px;
  padding: 30px 0 0;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
}

.footer-col {
  margin-bottom: 8px;
}

.footer-heading {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.footer-heading-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.footer-heading-row .footer-heading {
  margin-bottom: 0;
}

.footer-decor {
  width: 3px;
  height: 18px;
  background: var(--color-accent);
  border-radius: 2px;
  flex-shrink: 0;
}

.contact-link {
  color: #1a1a1a;
  transition: color var(--transition-fast);
}
.contact-link:hover { color: var(--color-accent); }

/* 热带农业政策、科技与产业支撑单位 */
.link-categories {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.link-cat-btn {
  padding: 6px 16px;
  font-size: 14px;
  color: #333333;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.link-cat-btn:hover,
.link-cat-btn.active {
  color: #333333;
  border-color: var(--color-accent);
  background: rgba(184, 114, 53, 0.15);
}

.link-units {
  overflow: hidden;
  transition: max-height 0.3s ease;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.link-unit-item {
  font-size: 13px;
  color: #333333;
  transition: color var(--transition-fast);
  line-height: 2;
}
.link-unit-item:hover { color: var(--color-accent); }

.link-empty {
  font-size: 13px;
  color: rgba(0,0,0,0.3);
}

/* 联系我们 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.contact-list li {
  font-size: 14px;
  color: #333333;
}

/* 版权 */
.footer-copyright {
  border-top: 1px solid rgba(0,0,0,0.08);
  padding: 8px 0;
  text-align: center;
}
.footer-copyright p {
  font-size: 12px;
  color: #333333;
  line-height: 1.8;
}

@media (min-width: 768px) {
  .footer-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .footer-copyright {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .site-footer { padding: 24px 0 0; }
  .link-categories { flex-direction: column; }
  .link-cat-btn { text-align: center; }
}
</style>
