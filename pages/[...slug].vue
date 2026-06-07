<template>
  <div class="not-found">
    <h1 class="not-found-code">404</h1>
    <p class="not-found-text">页面不存在</p>
    <NuxtLink to="/" class="not-found-link">返回首页</NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

usePageSeo({
  title: '页面不存在',
  description: '您访问的页面不存在，请返回首页。',
  noindex: true
})
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-code {
  font-size: 72px;
  font-weight: 700;
  color: var(--color-accent);
}

.not-found-text {
  font-size: 18px;
  color: var(--color-text-muted);
  margin: 16px 0 32px;
}

.not-found-link {
  font-size: 16px;
  color: var(--color-accent);
  padding: 10px 24px;
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  transition: all var(--transition-fast);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.not-found-link:hover {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
</style>
