<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">首页</NuxtLink><span> &gt; </span><span>个人中心</span></nav>
      <h1 class="page-title">个人中心</h1>
      <div class="user-shell">
        <aside class="user-sidebar">
          <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">{{ t.label }}</button>
          <button class="tab-btn logout-btn" @click="logout">退出登录</button>
        </aside>
        <main class="user-main">
          <!-- 我的信息 -->
          <div v-if="activeTab === 'info'" class="tab-panel">
            <h2>我的信息</h2>
            <div class="form-group"><label>手机号</label><input :value="user.phone" disabled class="input"></div>
            <div class="form-group"><label>姓名</label><input v-model="form.real_name" class="input"></div>
            <button class="btn-save" @click="saveProfile">保存</button>
            <p v-if="msg" class="msg">{{ msg }}</p>
          </div>
          <!-- 我的留言 -->
          <div v-if="activeTab === 'messages'" class="tab-panel">
            <h2>我的留言及回复</h2>
            <div v-if="myMessages.length" class="msg-list">
              <div v-for="m in myMessages" :key="m.id" class="msg-item">
                <div class="msg-head"><span class="msg-cat">{{ m.category }}</span><span class="msg-time">{{ m.createdAt?.slice(0,10) }}</span></div>
                <p class="msg-title">{{ m.title }}</p>
                <p class="msg-content">{{ m.content?.slice(0,100) }}{{ m.content?.length > 100 ? '...' : '' }}</p>
                <div v-if="m.reply" class="msg-reply"><strong>回复：</strong>{{ m.reply }}</div>
              </div>
            </div>
            <div v-else class="empty">暂无留言</div>
          </div>
          <!-- 通知 -->
          <div v-if="activeTab === 'notifications'" class="tab-panel">
            <h2>站内通知</h2>
            <div v-if="notifications.length" class="msg-list">
              <div v-for="n in notifications" :key="n.id" class="msg-item" :class="{ unread: !n.isRead }">
                <p>{{ n.message }}</p><span class="msg-time">{{ n.createdAt?.slice(0,16) }}</span>
              </div>
            </div>
            <div v-else class="empty">暂无通知</div>
          </div>
          <!-- 修改密码 -->
          <div v-if="activeTab === 'password'" class="tab-panel">
            <h2>修改密码</h2>
            <div class="form-group"><label>新密码</label><input v-model="pwd.new" type="password" class="input"></div>
            <div class="form-group"><label>确认密码</label><input v-model="pwd.confirm" type="password" class="input"></div>
            <button class="btn-save" @click="changePwd">修改</button>
            <p v-if="pwdMsg" class="msg">{{ pwdMsg }}</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
usePageSeo({ title: '个人中心', noindex: true })

const tabs = [{ key: 'info', label: '我的信息' }, { key: 'messages', label: '我的留言' }, { key: 'notifications', label: '站内通知' }, { key: 'password', label: '修改密码' }]
const activeTab = ref('info')
const user = reactive({ phone: '', realName: '' })
const form = reactive({ real_name: '' })
const pwd = reactive({ new: '', confirm: '' })
const msg = ref('')
const pwdMsg = ref('')
const myMessages = ref([])
const notifications = ref([])

const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : ''

onMounted(async () => {
  if (!token) { navigateTo('/login'); return }
  const info = localStorage.getItem('user_info')
  if (info) { try { Object.assign(user, JSON.parse(info)); form.real_name = user.realName } catch {} }
  // 加载留言
  try { const r = await $fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } }); if (r.code === 200) myMessages.value = r.data.items || [] } catch {}
  // 加载通知
  try { const r = await $fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } }); if (r.code === 200) notifications.value = r.data } catch {}
})

async function saveProfile() {
  try {
    await $fetch('/api/user/profile', { method: 'PUT', body: { real_name: form.real_name }, headers: { Authorization: `Bearer ${token}` } })
    msg.value = '保存成功'; user.realName = form.real_name
    localStorage.setItem('user_info', JSON.stringify({ phone: user.phone, realName: form.real_name }))
  } catch (e) { msg.value = e.data?.message || '保存失败' }
}

function changePwd() { if (pwd.new.length < 6) { pwdMsg.value = '密码至少6位'; return }; if (pwd.new !== pwd.confirm) { pwdMsg.value = '两次密码不一致'; return }; pwdMsg.value = '密码修改功能需后端支持' }

function logout() { localStorage.removeItem('user_token'); localStorage.removeItem('user_info'); navigateTo('/') }
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 28px; }
.user-shell { display: flex; gap: 30px; max-width: 900px; margin: 0 auto; }
.user-sidebar { width: 160px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; }
.tab-btn { padding: 10px 16px; text-align: left; border-radius: var(--radius-sm); font-size: 14px; cursor: pointer; border: none; background: var(--color-bg); color: var(--color-text); transition: all var(--transition-fast); }
.tab-btn:hover { background: var(--color-bg-light); }
.tab-btn.active { background: var(--color-accent); color: var(--color-on-accent); font-weight: 600; }
.logout-btn { margin-top: 16px; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 12px; }
.user-main { flex: 1; background: var(--color-bg-card); border-radius: var(--radius-md); padding: 28px; }
.tab-panel h2 { font-size: 20px; margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.input { width: 100%; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 14px; outline: none; }
.input:focus { border-color: var(--color-accent); }
.input:disabled { background: var(--color-bg-light); color: var(--color-text-muted); }
.btn-save { padding: 10px 24px; background: var(--color-accent); color: var(--color-on-accent); border-radius: var(--radius-sm); cursor: pointer; min-height: 44px; }
.btn-save:hover { opacity: 0.9; }
.msg { margin-top: 12px; font-size: 14px; color: var(--color-success); }
.msg-list { display: flex; flex-direction: column; gap: 12px; }
.msg-item { padding: 14px; background: var(--color-bg); border-radius: var(--radius-sm); }
.msg-item.unread { border-left: 3px solid var(--color-accent); }
.msg-head { display: flex; justify-content: space-between; margin-bottom: 6px; }
.msg-cat { font-size: 12px; color: var(--color-accent); }
.msg-time { font-size: 12px; color: var(--color-text-muted); }
.msg-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.msg-content { font-size: 13px; color: var(--color-text-secondary); }
.msg-reply { margin-top: 8px; padding: 8px 12px; background: var(--color-bg-light); border-radius: var(--radius-sm); font-size: 13px; }
.empty { text-align: center; color: var(--color-text-muted); padding: 40px 0; }
@media (max-width: 767px) { .user-shell { flex-direction: column; } .user-sidebar { width: 100%; flex-direction: row; overflow-x: auto; } .tab-btn { white-space: nowrap; } }
</style>
