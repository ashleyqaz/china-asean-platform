<template>
  <div class="admin-shell"><AdminSidebar /><main class="main">
    <div class="head"><h1>合作项目</h1><button class="btn" @click="openForm()">新增项目</button></div>
    <table class="tbl"><thead><tr><th>ID</th><th>名称</th><th>参与方</th><th>时间</th><th>重点</th><th>操作</th></tr></thead><tbody><tr v-for="p in items" :key="p.id"><td>{{p.id}}</td><td>{{p.name}}</td><td>{{p.participants}}</td><td>{{p.startDate}}~{{p.endDate}}</td><td>{{p.isFeatured?'是':'否'}}</td><td><button class="sm" @click="openForm(p)">编辑</button><button class="sm del" @click="del(p.id)">删除</button></td></tr></tbody></table>
    <div v-if="show" class="modal-overlay" @click.self="show=false"><div class="modal"><h3>{{editId?'编辑':'新增'}}</h3><div class="fg"><label>名称</label><input v-model="f.name" class="inp"></div><div class="fg"><label>参与方</label><input v-model="f.participants" class="inp"></div><div class="fg"><label>开始日期</label><input v-model="f.start_date" class="inp"></div><div class="fg"><label>结束日期</label><input v-model="f.end_date" class="inp"></div><div class="fg"><label>描述</label><textarea v-model="f.description" class="inp" rows="3"></textarea></div><div class="fg"><label>封面图URL</label><input v-model="f.cover_image" class="inp"></div><div class="fg"><label><input type="checkbox" v-model="f.is_featured"> 重点推荐</label></div><div class="acts"><button class="btn" @click="save">保存</button><button class="btn-cancel" @click="show=false">取消</button></div></div></div>
  </main></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const api = useAdminApi(); const items = ref([]); const show = ref(false); const editId = ref(null)
const f = reactive({ name:'', participants:'', start_date:'', end_date:'', description:'', cover_image:'', is_featured:false })
async function load(){ try { const r = await api.get('/projects'); if(r.code===200) items.value=r.data } catch{}}
function openForm(p){ if(p){ editId.value=p.id; f.name=p.name; f.participants=p.participants; f.start_date=p.startDate||''; f.end_date=p.endDate||''; f.description=p.description; f.cover_image=p.coverImage||''; f.is_featured=p.isFeatured } else { editId.value=null; Object.assign(f,{name:'',participants:'',start_date:'',end_date:'',description:'',cover_image:'',is_featured:false}) } show.value=true }
async function save(){ try { editId.value?await api.put(`/projects/${editId.value}`,{...f}):await api.post('/projects',{...f}); show.value=false; load() } catch{} }
async function del(id){ if(!confirm('确定删除？'))return; await api.del(`/projects/${id}`); load() }
onMounted(load)
</script>
<style scoped>
.admin-shell{display:flex;min-height:100vh}.main{flex:1;padding:32px;background:var(--color-bg-light)}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.head h1{font-size:24px;font-weight:700}.btn{padding:10px 20px;background:var(--color-accent);color:var(--color-on-accent);border-radius:4px;cursor:pointer;min-height:44px}.btn:hover{opacity:.9}.btn-cancel{padding:10px 20px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;min-height:44px}.sm{padding:4px 12px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;margin-right:6px;font-size:13px}.sm:hover{background:var(--color-bg-light)}.del{color:var(--color-error);border-color:var(--color-error)}.tbl{width:100%;border-collapse:collapse;background:var(--color-bg);border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}.tbl th,.tbl td{padding:12px 16px;text-align:left;border-bottom:1px solid var(--color-border);font-size:14px}.tbl th{background:var(--color-table-header);font-weight:600}.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:200}.modal{background:var(--color-bg);border-radius:8px;padding:32px;width:480px;max-width:90vw}.modal h3{margin-bottom:20px}.fg{margin-bottom:16px}.fg label{display:block;font-size:14px;font-weight:600;margin-bottom:4px}.inp{width:100%;padding:8px 12px;border:1px solid var(--color-border);border-radius:4px;font-size:14px;outline:none}.inp:focus{border-color:var(--color-accent)}.acts{display:flex;gap:12px;margin-top:20px}
</style>
