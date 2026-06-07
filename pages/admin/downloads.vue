<template>
  <div class="admin-shell"><AdminSidebar /><main class="main">
    <div class="head"><h1>资料下载</h1><button class="btn" @click="openForm()">新增</button></div>
    <table class="tbl"><thead><tr><th>ID</th><th>标题</th><th>分类</th><th>大小</th><th>下载次数</th><th>操作</th></tr></thead><tbody><tr v-for="d in items" :key="d.id"><td>{{d.id}}</td><td>{{d.title}}</td><td>{{d.category}}</td><td>{{d.fileSize}}</td><td>{{d.downloadCount}}</td><td><button class="sm" @click="openForm(d)">编辑</button><button class="sm del" @click="del(d.id)">删除</button></td></tr></tbody></table>
    <div v-if="show" class="modal-overlay" @click.self="show=false"><div class="modal"><h3>{{editId?'编辑':'新增'}}</h3><div class="fg"><label>标题</label><input v-model="f.title" class="inp"></div><div class="fg"><label>分类</label><select v-model="f.category" class="inp"><option v-for="c in cats" :key="c" :value="c">{{c}}</option></select></div><div class="fg"><label>文件地址</label><input v-model="f.file_url" class="inp"></div><div class="fg"><label>文件大小</label><input v-model="f.file_size" class="inp"></div><div class="fg"><label>描述</label><input v-model="f.description" class="inp"></div><div class="acts"><button class="btn" @click="save">保存</button><button class="btn-cancel" @click="show=false">取消</button></div></div></div>
  </main></div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
const api = useAdminApi(); const items = ref([]); const show = ref(false); const editId = ref(null)
const cats = ['政策文件','技术标准','研究报告','培训教材']
const f = reactive({ title:'', category:'政策文件', file_url:'', file_size:'', description:'' })
async function load(){ try { const r = await api.get('/downloads'); if(r.code===200) items.value=r.data } catch{}}
function openForm(d){ if(d){ editId.value=d.id; f.title=d.title; f.category=d.category; f.file_url=d.fileUrl; f.file_size=d.fileSize; f.description=d.description } else { editId.value=null; Object.assign(f,{title:'',category:'政策文件',file_url:'',file_size:'',description:''}) } show.value=true }
async function save(){ try { editId.value?await api.put(`/downloads/${editId.value}`,{...f}):await api.post('/downloads',{...f}); show.value=false; load() } catch{} }
async function del(id){ if(!confirm('确定删除？'))return; await api.del(`/downloads/${id}`); load() }
onMounted(load)
</script>

<style scoped>
.admin-shell{display:flex;min-height:100vh}.main{flex:1;padding:32px;background:var(--color-bg-light)}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.head h1{font-size:24px;font-weight:700}.btn{padding:10px 20px;background:var(--color-accent);color:var(--color-on-accent);border-radius:4px;cursor:pointer;min-height:44px}.btn:hover{opacity:.9}.btn-cancel{padding:10px 20px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;min-height:44px}.sm{padding:4px 12px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;margin-right:6px;font-size:13px}.sm:hover{background:var(--color-bg-light)}.del{color:var(--color-error);border-color:var(--color-error)}.tbl{width:100%;border-collapse:collapse;background:var(--color-bg);border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}.tbl th,.tbl td{padding:12px 16px;text-align:left;border-bottom:1px solid var(--color-border);font-size:14px}.tbl th{background:var(--color-table-header);font-weight:600}.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:200}.modal{background:var(--color-bg);border-radius:8px;padding:32px;width:480px;max-width:90vw}.modal h3{margin-bottom:20px}.fg{margin-bottom:16px}.fg label{display:block;font-size:14px;font-weight:600;margin-bottom:4px}.inp{width:100%;padding:8px 12px;border:1px solid var(--color-border);border-radius:4px;font-size:14px;outline:none}.inp:focus{border-color:var(--color-accent)}.acts{display:flex;gap:12px;margin-top:20px}
</style>
