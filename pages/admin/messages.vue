<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>留言管理</h1>
        <select v-model="statusFilter" @change="page=1; loadItems()" class="filter-select">
          <option value="">全部</option>
          <option value="unread">未读</option>
          <option value="read">已读</option>
        </select>
      </div>

      <table class="admin-table">
        <thead>
          <tr><th>ID</th><th>用户</th><th>分类</th><th>标题</th><th>状态</th><th>时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" :class="{ unread: !item.isRead }">
            <td>{{ item.id }}</td>
            <td>{{ item.user?.realName || item.senderName }}<br><small>{{ item.user?.phone || item.senderPhone }}</small></td>
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.isRead ? '已读' : '未读' }}</td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td class="actions">
              <NuxtLink :to="`/admin/messages/${item.id}`" class="btn-sm">查看</NuxtLink>
              <button v-if="!item.isRead" class="btn-sm" @click="markRead(item.id)">标为已读</button>
              <button class="btn-sm btn-danger" @click="deleteItem(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="total > size" class="pagination">
        <button :disabled="page <= 1" @click="page--; loadItems()">上一页</button>
        <span>第 {{ page }} / {{ Math.ceil(total / size) }} 页</span>
        <button :disabled="page >= Math.ceil(total / size)" @click="page++; loadItems()">下一页</button>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '留言管理 - 管理后台', meta: [{ name: 'robots', content: 'noindex' }] })

const api = useAdminApi()
const items = ref([]); const page = ref(1); const total = ref(0); const size = 20; const statusFilter = ref('')

async function loadItems() {
  try {
    const params = { page: page.value, size }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await api.get('/messages', params)
    if (res.code === 200) { items.value = res.data.items; total.value = res.data.total }
  } catch (e) {}
}
async function markRead(id) { await api.put(`/messages/${id}/read`); loadItems() }
async function deleteItem(id) { if (!confirm('确定删除？')) return; await api.del(`/messages/${id}`); loadItems() }
function formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` }
onMounted(loadItems)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.filter-select { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; }
.btn-sm { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; cursor: pointer; margin-right: 6px; text-decoration: none; color: var(--color-text); display: inline-block; }
.btn-sm:hover { background: var(--color-bg-light); }
.btn-danger { color: var(--color-error); border-color: var(--color-error); }
.btn-danger:hover { background: var(--color-danger-bg); }
.admin-table { width: 100%; border-collapse: collapse; background: var(--color-bg); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.admin-table th, .admin-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 14px; }
.admin-table th { background: var(--color-table-header); font-weight: 600; }
tr.unread { background: var(--color-warning-bg); }
.actions { white-space: nowrap; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; }
.pagination button { padding: 8px 16px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; min-height: 44px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
