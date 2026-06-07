<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>{{ isNew ? '新增资讯' : '编辑资讯' }}</h1>
        <NuxtLink to="/admin/news" class="btn-cancel">← 返回列表</NuxtLink>
      </div>

      <div class="form-card">
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" class="form-input">
        </div>
        <div class="form-group">
          <label>摘要</label>
          <textarea v-model="form.summary" class="form-input" rows="3"/>
        </div>
        <div class="form-group">
          <label>正文（支持 HTML）</label>
          <textarea v-model="form.content" class="form-input" rows="12" style="font-family: monospace;"/>
        </div>
        <div class="form-group">
          <label>封面图地址（可选）</label>
          <input v-model="form.cover_image" class="form-input">
        </div>
        <div class="form-group">
          <label>发布时间</label>
          <input v-model="form.publish_time" type="datetime-local" class="form-input">
        </div>
        <div class="form-group">
          <label><input type="checkbox" v-model="form.is_published"> 发布</label>
        </div>
        <button class="btn-primary" @click="saveItem">保存</button>
        <p v-if="msg" class="msg">{{ msg }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '编辑资讯 - 管理后台' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const api = useAdminApi()
const msg = ref('')

const form = reactive({
  title: '', summary: '', content: '', cover_image: '', publish_time: '', is_published: true
})

async function loadItem() {
  if (isNew.value) return
  try {
    const res = await api.get(`/news/${route.params.id}`)
    if (res.code === 200) {
      const d = res.data
      form.title = d.title; form.summary = d.summary || ''; form.content = d.content || ''
      form.cover_image = d.coverImage || ''
      if (d.publishTime) {
        const dt = new Date(d.publishTime)
        form.publish_time = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}T${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`
      }
      form.is_published = d.isPublished
    }
  } catch (e) {}
}

async function saveItem() {
  try {
    const data = {
      title: form.title, summary: form.summary, content: form.content,
      cover_image: form.cover_image, publish_time: form.publish_time || undefined,
      is_published: form.is_published
    }
    if (isNew.value) {
      const res = await api.post('/news', data)
      if (res.code === 200) { msg.value = '创建成功'; navigateTo(`/admin/news/${res.data.id}`) }
    } else {
      await api.put(`/news/${route.params.id}`, data)
      msg.value = '保存成功'
    }
  } catch (e) { msg.value = '保存失败' }
}

onMounted(loadItem)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; transition: opacity var(--transition-fast); min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.btn-cancel { padding: 8px 16px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; text-decoration: none; color: var(--color-text); min-height: 44px; display: inline-flex; align-items: center; }
.form-card { background: var(--color-bg); border-radius: 8px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); max-width: 800px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; outline: none; }
.form-input:focus { border-color: var(--color-accent); }
.msg { margin-top: 16px; color: var(--color-success); font-size: 14px; }
</style>
