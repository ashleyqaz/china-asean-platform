<template>
  <div class="admin-layout">
    <AdminTopBar />
    <slot />
  </div>
</template>

<script setup>
import AdminTopBar from '~/components/AdminTopBar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f9fafb;
}
</style>
