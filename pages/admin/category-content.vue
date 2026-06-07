<template>
  <div class="admin-shell"><AdminSidebar /><main class="main">
    <h1>栏目内容管理</h1>
    <div class="selector"><label>选择栏目：</label><select v-model="selectedSlug" @change="loadContent" class="sel">
      <option v-for="m in menus" :key="m.slug" :value="m.slug">{{ m.name }}</option>
    </select></div>
    <div v-if="selectedSlug" class="card">
      <textarea v-model="content" class="editor" rows="22"/>
      <button class="btn" @click="save">保存</button><p v-if="msg" class="msg">{{ msg }}</p>
    </div>
  </main></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const api = useAdminApi()
const menus = ref([])
const selectedSlug = ref('')
const content = ref('')
const msg = ref('')

onMounted(async () => {
  try { const r = await api.get('/nav-menus'); if (r.code===200) menus.value=r.data; if (menus.value.length) { selectedSlug.value=menus.value[0].slug; loadContent() } } catch {}
})

async function loadContent() {
  try { const r = await $fetch('/api/category-content', { params: { slug: selectedSlug.value } }); if (r.code===200) content.value=r.data.content } catch {}
}

async function save() {
  try { await api.put('/category-content', { slug: selectedSlug.value, content: content.value }); msg.value='保存成功' } catch { msg.value='保存失败' }
}
</script>

<style scoped>
.admin-shell{display:flex;min-height:100vh}.main{flex:1;padding:32px;background:var(--color-bg-light)}.main h1{font-size:24px;font-weight:700;margin-bottom:24px}
.selector{display:flex;align-items:center;gap:12px;margin-bottom:20px;font-size:14px}
.sel{padding:8px 12px;border:1px solid var(--color-border);border-radius:4px;font-size:14px;outline:none}
.card{background:var(--color-bg);border-radius:8px;padding:24px;max-width:900px}
.editor{width:100%;padding:12px;border:1px solid var(--color-border);border-radius:4px;font-family:monospace;font-size:14px;outline:none;resize:vertical}.editor:focus{border-color:var(--color-accent)}
.btn{padding:10px 24px;background:var(--color-accent);color:var(--color-on-accent);border-radius:4px;cursor:pointer;margin-top:12px;min-height:44px}.btn:hover{opacity:.9}
.msg{margin-top:12px;color:var(--color-success);font-size:14px}
</style>
