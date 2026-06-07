<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main class="admin-main">
      <h1 class="page-title">系统设置</h1>

      <div class="settings-section">
        <h3>联系信息</h3>
        <div class="form-group"><label>地址</label><input v-model="form.address" class="form-input"></div>
        <div class="form-group"><label>电话</label><input v-model="form.phone" class="form-input"></div>
        <div class="form-group"><label>邮箱</label><input v-model="form.email" class="form-input"></div>
        <div class="form-group"><label>传真</label><input v-model="form.fax" class="form-input"></div>
        <div class="form-group"><label>头部备注文字（留空隐藏）</label><input v-model="form.header_note" class="form-input"></div>
        <button class="btn-primary" @click="saveContact">保存联系信息</button>
      </div>

      <div class="settings-section">
        <h3>微信公众号二维码</h3>
        <div class="form-group">
          <label>当前二维码</label>
          <img :src="form.qrcode_url || '/images/qrcode-placeholder.svg'" class="qrcode-preview" alt="二维码">
        </div>
        <div class="form-group"><label>二维码图片地址</label><input v-model="form.qrcode_url" class="form-input"></div>
        <button class="btn-primary" @click="saveQrcode">保存二维码</button>
      </div>

      <div class="settings-section">
        <h3>站点信息</h3>
        <div class="form-group"><label>站点名称</label><input v-model="form.site_name" class="form-input"></div>
        <div class="form-group"><label>版权文字</label><input v-model="form.copyright_text" class="form-input"></div>
        <div class="form-group"><label>备案号</label><input v-model="form.icp_number" class="form-input"></div>
        <button class="btn-primary" @click="saveSiteConfig">保存站点信息</button>
      </div>

      <p v-if="msg" class="msg">{{ msg }}</p>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: '系统设置 - 管理后台', meta: [{ name: 'robots', content: 'noindex' }] })

const api = useAdminApi()
const msg = ref('')
const form = reactive({
  address: '', phone: '', email: '', fax: '', header_note: '', qrcode_url: '',
  site_name: '', copyright_text: '', icp_number: ''
})

async function loadSettings() {
  try {
    const [contactRes, qrcodeRes, configRes] = await Promise.all([
      $fetch('/api/contact-info'),
      $fetch('/api/qrcode'),
      $fetch('/api/site-config')
    ])
    if (contactRes.code === 200) {
      form.address = contactRes.data.address || ''
      form.phone = contactRes.data.phone || ''
      form.email = contactRes.data.email || ''
      form.fax = contactRes.data.fax || ''
      form.header_note = contactRes.data.header_note || ''
    }
    if (qrcodeRes.code === 200) form.qrcode_url = qrcodeRes.data.imageUrl || ''
    if (configRes.code === 200 && configRes.data) {
      form.site_name = configRes.data.siteName || ''
      form.copyright_text = configRes.data.copyrightText || ''
      form.icp_number = configRes.data.icpNumber || ''
    }
  } catch (e) { console.error(e) }
}

async function saveContact() {
  try {
    await api.put('/settings', { address: form.address, phone: form.phone, email: form.email, fax: form.fax, header_note: form.header_note })
    msg.value = '联系信息保存成功'
  } catch (e) { msg.value = '保存失败' }
}

async function saveQrcode() {
  try {
    await api.put('/settings', { qrcode_url: form.qrcode_url })
    msg.value = '二维码保存成功'
  } catch (e) { msg.value = '保存失败' }
}

async function saveSiteConfig() {
  try {
    await api.put('/settings', { site_name: form.site_name, copyright_text: form.copyright_text, icp_number: form.icp_number })
    msg.value = '站点信息保存成功'
  } catch (e) { msg.value = '保存失败' }
}

onMounted(loadSettings)
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 32px; background: var(--color-bg-light); min-height: 100vh; }
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 32px; }
.settings-section { background: var(--color-bg); border-radius: 8px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 24px; max-width: 600px; }
.settings-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border); }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 14px; outline: none; }
.form-input:focus { border-color: var(--color-accent); }
.btn-primary { padding: 10px 20px; background: var(--color-accent); color: var(--color-on-accent); border-radius: 4px; font-size: 14px; cursor: pointer; transition: opacity var(--transition-fast); min-height: 44px; }
.btn-primary:hover { opacity: 0.9; }
.qrcode-preview { width: 120px; height: 120px; object-fit: contain; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 8px; }
.msg { margin-top: 16px; color: var(--color-success); font-size: 14px; }
</style>
