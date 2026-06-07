<template>
  <div class="admin-shell"><AdminSidebar /><main class="main"><h1>关于我们</h1><div class="card"><textarea v-model="content" class="editor" rows="20"/><button class="btn" @click="save">保存</button><p v-if="msg" class="msg">{{ msg }}</p></div></main></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const api = useAdminApi()
const content = ref(''); const msg = ref('')
onMounted(async () => { try { const r = await $fetch('/api/about'); if (r.code===200) content.value=r.data.content } catch {} })
async function save() { try { await api.put('/about', { content: content.value }); msg.value='保存成功' } catch { msg.value='保存失败' } }
</script>

<style scoped>
.admin-shell{display:flex;min-height:100vh}.main{flex:1;padding:32px;background:var(--color-bg-light)}.main h1{font-size:24px;font-weight:700;margin-bottom:24px}.card{background:var(--color-bg);border-radius:8px;padding:24px;max-width:800px}.editor{width:100%;padding:12px;border:1px solid var(--color-border);border-radius:4px;font-family:monospace;font-size:14px;outline:none;resize:vertical}.editor:focus{border-color:var(--color-accent)}.btn{padding:10px 24px;background:var(--color-accent);color:var(--color-on-accent);border-radius:4px;cursor:pointer;margin-top:12px;min-height:44px}.btn:hover{opacity:.9}.msg{margin-top:12px;color:var(--color-success);font-size:14px}
</style>
