<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>导航菜单管理</h1>
        <button class="btn-primary" @click="showForm = true; editingItem = null; resetForm()">新增菜单</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>名称</th><th>路由标识</th><th>排序</th><th>高亮</th><th>可见</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.slug }}</td>
            <td>{{ item.sortOrder }}</td>
            <td>{{ item.isHighlight ? '是' : '否' }}</td>
            <td>{{ item.isVisible ? '是' : '否' }}</td>
            <td class="actions">
              <button class="btn-sm" @click="editItem(item)">编辑</button>
              <button class="btn-sm btn-danger" @click="deleteItem(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 编辑弹窗 -->
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal">
          <h3>{{ editingItem ? '编辑菜单' : '新增菜单' }}</h3>
          <div class="form-group">
            <label>名称</label>
            <input v-model="form.name" class="form-input">
          </div>
          <div class="form-group">
            <label>路由标识 (slug)</label>
            <input v-model="form.slug" class="form-input">
          </div>
          <div class="form-group">
            <label>排序</label>
            <input v-model.number="form.sort_order" type="number" class="form-input">
          </div>
          <div class="form-group">
            <label><input type="checkbox" v-model="form.is_highlight"> 高亮</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox" v-model="form.is_visible"> 可见</label>
          </div>
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
useHead({ title: '导航菜单管理 - 管理后台' })

const items = ref([])
const showForm = ref(false)
const editingItem = ref(null)
const form = reactive({ name: '', slug: '', sort_order: 0, is_highlight: false, is_visible: true })

const api = useAdminApi()

function resetForm() {
  Object.assign(form, { name: '', slug: '', sort_order: 0, is_highlight: false, is_visible: true })
}

async function loadItems() {
  try {
    const res = await api.get('/nav-menus')
    if (res.code === 200) items.value = res.data
  } catch (e) { console.error(e) }
}

function editItem(item) {
  editingItem.value = item
  form.name = item.name
  form.slug = item.slug
  form.sort_order = item.sortOrder
  form.is_highlight = item.isHighlight
  form.is_visible = item.isVisible
  showForm.value = true
}

async function saveItem() {
  try {
    if (editingItem.value) {
      await api.put(`/nav-menus/${editingItem.value.id}`, { ...form })
    } else {
      await api.post('/nav-menus', { ...form })
    }
    showForm.value = false
    loadItems()
  } catch (e) { console.error(e) }
}

async function deleteItem(id) {
  if (!confirm('确定删除？')) return
  await api.del(`/nav-menus/${id}`)
  loadItems()
}

onMounted(loadItems)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; transition: opacity var(--transition-fast); min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.btn-sm { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; cursor: pointer; margin-right: 6px; }
.btn-sm:hover { background: var(--color-accent-light); }
.btn-danger { color: var(--color-error); border-color: var(--color-error); }
.btn-danger:hover { background: var(--color-danger-bg); }
.btn-cancel { padding: 10px 20px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; min-height: 44px; }
.admin-table { width: 100%; border-collapse: collapse; background: var(--color-bg); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.admin-table th, .admin-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 14px; }
.admin-table th { background: var(--color-table-header); font-weight: 600; }
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
