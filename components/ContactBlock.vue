<template>
  <div class="contact-section">
    <NuxtLink to="/message" class="contact-title">联系我们</NuxtLink>
    <p class="contact-desc">
      这是一个点进去可以留言的信箱，设几个选项"交流，提供经验，信息，项目合作建议，考察交流"
    </p>
    <div class="contact-info">
      <p class="contact-item">地址：{{ address }}</p>
      <p class="contact-item">电话：{{ phone }}</p>
    </div>
  </div>
</template>

<script setup>
const address = ref('')
const phone = ref('')

onMounted(async () => {
  try {
    const res = await $fetch('/api/contact-info')
    if (res.code === 200) {
      address.value = res.data.address || ''
      phone.value = res.data.phone || ''
    }
  } catch (e) {
    console.error('Failed to load contact info:', e)
  }
})
</script>

<style scoped>
.contact-section {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 20px;
  margin-top: 40px;
}

.contact-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
  transition: color var(--transition-fast);
  text-decoration: none;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.contact-title:hover {
  color: var(--color-accent);
}

.contact-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  line-height: 1.6;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

@media (max-width: 767px) {
  .contact-section {
    padding: 16px;
    margin-top: 24px;
  }
}
</style>
