<template>
  <div class="admin-shell"><AdminSidebar /><main class="main">
    <div class="head"><h1>邮件订阅管理</h1><span class="count">共 {{ items.length }} 人订阅</span></div>
    <table class="tbl"><thead><tr><th>ID</th><th>邮箱</th><th>状态</th><th>订阅时间</th></tr></thead><tbody><tr v-for="s in items" :key="s.id"><td>{{s.id}}</td><td>{{s.email}}</td><td>{{s.isActive?'活跃':'停用'}}</td><td>{{s.subscribedAt?.slice(0,10)}}</td></tr></tbody></table>
  </main></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const api = useAdminApi(); const items = ref([])
onMounted(async () => { try { const r = await api.get('/subscribers'); if(r.code===200) items.value=r.data } catch{} })
</script>
<style scoped>
.admin-shell{display:flex;min-height:100vh}.main{flex:1;padding:32px;background:var(--color-bg-light)}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.head h1{font-size:24px;font-weight:700}.count{font-size:14px;color:var(--color-text-muted)}.tbl{width:100%;border-collapse:collapse;background:var(--color-bg);border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}.tbl th,.tbl td{padding:12px 16px;text-align:left;border-bottom:1px solid var(--color-border);font-size:14px}.tbl th{background:var(--color-table-header);font-weight:600}
</style>
