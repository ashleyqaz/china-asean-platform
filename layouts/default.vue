<template>
  <div class="layout">
    <HeaderNav />
    <main class="main-content">
      <slot />
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
import HeaderNav from '~/components/HeaderNav.vue'
import FooterSection from '~/components/FooterSection.vue'
</script>

<style scoped>
.layout { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; }
</style>
