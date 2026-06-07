<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-header">
        <h1>留言详情</h1>
        <NuxtLink to="/admin/messages" class="btn-cancel">← 返回列表</NuxtLink>
      </div>

      <div class="detail-card">
        <div class="detail-row"><span class="label">用户：</span>{{ message.user?.realName || message.senderName }} ({{ message.user?.phone || message.senderPhone }})</div>
        <div class="detail-row"><span class="label">留言对象：</span>{{ message.category }}</div>
        <div class="detail-row"><span class="label">标题：</span>{{ message.title }}</div>
        <div class="detail-row"><span class="label">邮箱：</span>{{ message.senderEmail || '未填写' }}</div>
        <div class="detail-row"><span class="label">时间：</span>{{ formatDate(message.createdAt) }}</div>
        <div class="detail-row">
          <span class="label">状态：</span>
          <span :class="message.isRead ? 'text-green' : 'text-orange'">{{ message.isRead ? '已读' : '未读' }}</span>
          <button v-if="!message.isRead" class="btn-sm" @click="markRead">标记已读</button>
        </div>
        <div class="detail-content">
          <h4>留言内容：</h4>
          <p class="content-text">{{ message.content }}</p>
        </div>
      </div>

      <div class="reply-card">
        <h4>{{ message.reply ? '已回复' : '回复留言' }}</h4>
        <div v-if="message.reply" class="reply-bubble">
          <p>{{ message.reply }}</p>
          <span class="reply-time" v-if="message.repliedAt">回复时间：{{ formatDate(message.repliedAt) }}</span>
        </div>
        <template v-else>
          <textarea v-model="replyText" class="form-textarea" rows="4" placeholder="输入回复内容..."/>
          <button class="btn-primary" @click="submitReply">提交回复</button>
        </template>
        <p v-if="msg" class="msg">{{ msg }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '留言详情 - 管理后台', meta: [{ name: 'robots', content: 'noindex' }] })

const route = useRoute(); const api = useAdminApi()
const message = ref({}); const replyText = ref(''); const msg = ref('')

async function loadMessage() {
  try { const res = await api.get(`/messages/${route.params.id}`); if (res.code === 200) message.value = res.data } catch (e) {}
}
async function markRead() { await api.put(`/messages/${route.params.id}/read`); message.value.isRead = true }
async function submitReply() {
  if (!replyText.value.trim()) return
  try { const res = await api.put(`/messages/${route.params.id}/reply`, { reply: replyText.value }); msg.value = '回复成功'; message.value = res.data; replyText.value = '' } catch (e) { msg.value = '回复失败' }
}
function formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` }
onMounted(loadMessage)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.btn-cancel { padding: 8px 16px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; cursor: pointer; text-decoration: none; color: var(--color-text); min-height: 44px; display: inline-flex; align-items: center; }
.btn-sm { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; cursor: pointer; margin-left: 8px; }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; margin-top: 12px; min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.detail-card, .reply-card { background: var(--color-bg); border-radius: 8px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 20px; max-width: 800px; }
.detail-row { margin-bottom: 12px; font-size: 14px; }
.label { font-weight: 600; }
.text-green { color: var(--color-success); }
.text-orange { color: var(--color-warning); }
.detail-content { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-border); }
.detail-content h4 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.content-text { font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
.reply-card h4 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
.reply-bubble { background: var(--color-bg-light); padding: 16px; border-radius: 4px; }
.reply-bubble p { font-size: 14px; margin-bottom: 8px; }
.reply-time { font-size: 12px; color: var(--color-text-muted); }
.form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; outline: none; resize: vertical; }
.form-textarea:focus { border-color: var(--color-accent); }
.msg { margin-top: 12px; font-size: 14px; color: var(--color-success); }
</style>
