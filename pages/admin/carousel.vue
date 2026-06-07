<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>轮播图管理</h1>
        <button class="btn-primary" @click="showForm = true; editingItem = null; resetForm()">新增轮播图</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr><th>ID</th><th>缩略图</th><th>标题</th><th>图注</th><th>排序</th><th>可见</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td><img :src="item.imageUrl" class="thumb-sm" :alt="item.title"></td>
            <td>{{ item.title }}</td>
            <td>{{ item.caption }}</td>
            <td>{{ item.sortOrder }}</td>
            <td>{{ item.isVisible ? '是' : '否' }}</td>
            <td class="actions">
              <button class="btn-sm" @click="editItem(item)">编辑</button>
              <button class="btn-sm btn-danger" @click="deleteItem(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal">
          <h3>{{ editingItem ? '编辑轮播图' : '新增轮播图' }}</h3>
          <div class="form-group"><label>图片地址</label><input v-model="form.image_url" class="form-input"></div>
          <div class="form-group"><label>标题</label><input v-model="form.title" class="form-input"></div>
          <div class="form-group"><label>图注 (caption)</label><input v-model="form.caption" class="form-input"></div>
          <div class="form-group"><label>跳转链接（可选）</label><input v-model="form.link_url" class="form-input"></div>
          <div class="form-group"><label>排序</label><input v-model.number="form.sort_order" type="number" class="form-input"></div>
          <div class="form-group"><label><input type="checkbox" v-model="form.is_visible"> 可见</label></div>
          <div class="modal-actions">
            <button class="btn-primary" @click="saveItem">保存</button>
            <button class="btn-cancel" @click="showForm = false">取消</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '轮播图管理 - 管理后台', meta: [{ name: 'robots', content: 'noindex' }] })

const items = ref([])
const showForm = ref(false)
const editingItem = ref(null)
const form = reactive({ image_url: '', title: '', caption: '', link_url: '', sort_order: 0, is_visible: true })
const api = useAdminApi()

function resetForm() { Object.assign(form, { image_url: '', title: '', caption: '', link_url: '', sort_order: 0, is_visible: true }) }
async function loadItems() { try { const res = await api.get('/carousel'); if (res.code === 200) items.value = res.data } catch (e) {} }
function editItem(item) {
  editingItem.value = item
  form.image_url = item.imageUrl; form.title = item.title; form.caption = item.caption || ''
  form.link_url = item.linkUrl || ''; form.sort_order = item.sortOrder; form.is_visible = item.isVisible
  showForm.value = true
}
async function saveItem() {
  try {
    if (editingItem.value) await api.put(`/carousel/${editingItem.value.id}`, { ...form })
    else await api.post('/carousel', { ...form })
    showForm.value = false; loadItems()
  } catch (e) {}
}
async function deleteItem(id) { if (!confirm('确定删除？')) return; await api.del(`/carousel/${id}`); loadItems() }
onMounted(loadItems)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.btn-sm { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; cursor: pointer; margin-right: 6px; }
.btn-sm:hover { background: var(--color-bg-light); }
.btn-danger { color: var(--color-error); border-color: var(--color-error); }
.btn-danger:hover { background: var(--color-danger-bg); }
.btn-cancel { padding: 10px 20px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; min-height: 44px; }
.admin-table { width: 100%; border-collapse: collapse; background: var(--color-bg); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.admin-table th, .admin-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 14px; }
.admin-table th { background: var(--color-table-header); font-weight: 600; }
.thumb-sm { width: 80px; height: 50px; object-fit: cover; border-radius: 4px; }
.actions { white-space: nowrap; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: var(--color-bg); border-radius: 8px; padding: 32px; width: 480px; max-width: 90vw; }
.modal h3 { margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; outline: none; }
.form-input:focus { border-color: var(--color-accent); }
.modal-actions { display: flex; gap: 12px; margin-top: 20px; }
</style>
