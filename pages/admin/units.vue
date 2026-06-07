<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>支撑单位管理</h1>
        <div class="header-actions">
          <select v-model="selectedCategory" @change="loadUnits" class="filter-select">
            <option value="">全部分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <button class="btn-primary" @click="showUnitForm = true; editingUnit = null; resetUnitForm()">新增单位</button>
        </div>
      </div>

      <!-- 分类管理 -->
      <div class="section">
        <h3>分类</h3>
        <div class="category-bar">
          <span v-for="cat in categories" :key="cat.id" class="cat-tag">
            {{ cat.name }}
            <button class="cat-edit-btn" @click="editCategory(cat)">✎</button>
            <button class="cat-delete-btn" @click="deleteCategory(cat.id)">×</button>
          </span>
          <button class="btn-sm" @click="showCatForm = true">+ 新增分类</button>
        </div>
      </div>

      <!-- 单位列表 -->
      <table class="admin-table">
        <thead>
          <tr><th>ID</th><th>所属分类</th><th>名称</th><th>排序</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="unit in units" :key="unit.id">
            <td>{{ unit.id }}</td>
            <td>{{ unit.category?.name }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.sortOrder }}</td>
            <td class="actions">
              <button class="btn-sm" @click="editUnit(unit)">编辑</button>
              <button class="btn-sm btn-danger" @click="deleteUnit(unit.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分类弹窗 -->
      <div v-if="showCatForm" class="modal-overlay" @click.self="showCatForm = false">
        <div class="modal">
          <h3>{{ editingCat ? '编辑分类' : '新增分类' }}</h3>
          <div class="form-group"><label>名称</label><input v-model="catForm.name" class="form-input"></div>
          <div class="form-group"><label>排序</label><input v-model.number="catForm.sort_order" type="number" class="form-input"></div>
          <div class="modal-actions">
            <button class="btn-primary" @click="saveCategory">保存</button>
            <button class="btn-cancel" @click="showCatForm = false">取消</button>
          </div>
        </div>
      </div>

      <!-- 单位弹窗 -->
      <div v-if="showUnitForm" class="modal-overlay" @click.self="showUnitForm = false">
        <div class="modal">
          <h3>{{ editingUnit ? '编辑单位' : '新增单位' }}</h3>
          <div class="form-group"><label>所属分类</label><select v-model="unitForm.category_id" class="form-input"><option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option></select></div>
          <div class="form-group"><label>名称</label><input v-model="unitForm.name" class="form-input"></div>
          <div class="form-group"><label>Logo地址（可选）</label><input v-model="unitForm.logo_url" class="form-input"></div>
          <div class="form-group"><label>官网链接（可选）</label><input v-model="unitForm.website_url" class="form-input"></div>
          <div class="form-group"><label>排序</label><input v-model.number="unitForm.sort_order" type="number" class="form-input"></div>
          <div class="modal-actions">
            <button class="btn-primary" @click="saveUnit">保存</button>
            <button class="btn-cancel" @click="showUnitForm = false">取消</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '支撑单位管理 - 管理后台' })

const api = useAdminApi()
const categories = ref([])
const units = ref([])
const selectedCategory = ref('')

const showCatForm = ref(false)
const editingCat = ref(null)
const catForm = reactive({ name: '', sort_order: 0 })

const showUnitForm = ref(false)
const editingUnit = ref(null)
const unitForm = reactive({ category_id: 1, name: '', logo_url: '', website_url: '', sort_order: 0 })

async function loadCategories() {
  try { const res = await api.get('/unit-categories'); if (res.code === 200) categories.value = res.data } catch (e) {}
}
async function loadUnits() {
  try {
    const params = selectedCategory.value ? { categoryId: selectedCategory.value } : {}
    const res = await api.get('/support-units', params)
    if (res.code === 200) units.value = res.data
  } catch (e) {}
}

function editCategory(cat) { editingCat.value = cat; catForm.name = cat.name; catForm.sort_order = cat.sortOrder; showCatForm.value = true }
async function saveCategory() {
  try {
    if (editingCat.value) await api.put(`/unit-categories/${editingCat.value.id}`, { ...catForm })
    else await api.post('/unit-categories', { ...catForm })
    showCatForm.value = false; loadCategories()
  } catch (e) {}
}
async function deleteCategory(id) { if (!confirm('确定删除？')) return; await api.del(`/unit-categories/${id}`); loadCategories(); loadUnits() }

function resetUnitForm() { Object.assign(unitForm, { category_id: categories.value[0]?.id || 1, name: '', logo_url: '', website_url: '', sort_order: 0 }) }
function editUnit(unit) {
  editingUnit.value = unit
  unitForm.category_id = unit.categoryId; unitForm.name = unit.name
  unitForm.logo_url = unit.logoUrl || ''; unitForm.website_url = unit.websiteUrl || ''
  unitForm.sort_order = unit.sortOrder
  showUnitForm.value = true
}
async function saveUnit() {
  try {
    if (editingUnit.value) await api.put(`/support-units/${editingUnit.value.id}`, { ...unitForm })
    else await api.post('/support-units', { ...unitForm })
    showUnitForm.value = false; loadUnits()
  } catch (e) {}
}
async function deleteUnit(id) { if (!confirm('确定删除？')) return; await api.del(`/support-units/${id}`); loadUnits() }

onMounted(async () => { await loadCategories(); await loadUnits() })
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.header-actions { display: flex; gap: 12px; align-items: center; }
.filter-select { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; transition: opacity var(--transition-fast); min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.btn-sm { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; cursor: pointer; margin-right: 6px; }
.btn-sm:hover { background: var(--color-accent-light); }
.btn-danger { color: var(--color-error); border-color: var(--color-error); }
.btn-danger:hover { background: var(--color-danger-bg); }
.btn-cancel { padding: 10px 20px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; min-height: 44px; }
.section { margin-bottom: 24px; }
.section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.category-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.cat-tag { padding: 6px 12px; background: var(--color-accent-light); border-radius: 4px; font-size: 14px; }
.cat-edit-btn, .cat-delete-btn { margin-left: 6px; font-size: 14px; cursor: pointer; color: var(--color-accent); }
.cat-delete-btn { color: var(--color-error); }
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
