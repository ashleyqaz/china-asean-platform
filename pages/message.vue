<template>
  <div class="message-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>
      <h1 class="page-title">留言信箱</h1>

      <form @submit.prevent="submitForm">
        <!-- 用户信息（自动带入，锁定不可编辑） -->
        <div class="block-card user-info-bar">
          <div class="user-info-item">
            <span class="info-label">姓名：</span>
            <input :value="userInfo.realName" class="info-input locked" disabled>
          </div>
          <div class="user-info-item">
            <span class="info-label">手机号：</span>
            <input :value="userInfo.phone" class="info-input locked" disabled>
          </div>
        </div>

        <!-- 第一区块：留言对象 + 标题 -->
        <div class="block-card">
          <div class="form-row">
            <label class="row-label">留言对象 <span class="required">*</span></label>
            <div class="row-field">
              <select v-model="form.category" class="form-select">
                <option value="">请选择</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label class="row-label">标题 <span class="required">*</span></label>
            <div class="row-field">
              <input
                v-model="form.title"
                type="text"
                class="form-input title-input"
                :class="{ 'input-error': titleError }"
                placeholder="请输入标题，不超过22字，请勿填写特殊符号"
                maxlength="22"
                @input="validateTitle">
              <p v-if="titleError" class="field-error">{{ titleError }}</p>
            </div>
          </div>
        </div>

        <!-- 第二区块：留言正文 -->
        <div class="block-card">
          <div class="form-row">
            <label class="row-label">留言正文 <span class="required">*</span></label>
            <div class="row-field">
              <textarea
                v-model="form.content"
                class="form-textarea"
                rows="8"
                maxlength="1000"
                placeholder="请输入留言内容"
                @input="contentLength = form.content.length"/>
              <span class="char-count">{{ contentLength }}/1000</span>
            </div>
          </div>
        </div>

        <!-- 第三区块：附件补充 -->
        <div class="block-card">
          <div class="form-row">
            <label class="row-label">附件补充</label>
            <div class="row-field">
              <div class="upload-area">
                <div class="upload-box" @click="triggerUpload">
                  <span class="upload-plus">+</span>
                </div>
                <input ref="fileInput" type="file" accept=".jpg,.png,.jpeg" multiple hidden @change="onFileChange">
                <!-- 缩略图列表 -->
                <div v-for="(file, idx) in files" :key="idx" class="upload-thumb">
                  <img :src="file.preview" :alt="file.name" class="thumb-img">
                  <button type="button" class="thumb-remove" @click="removeFile(idx)">×</button>
                </div>
              </div>
              <p class="upload-hint">附件信息将加密保护，请您安心上传</p>
              <p class="upload-hint">最多上传5张 50M以内的图片 支持扩展名：.jpg .png .jpeg</p>
            </div>
          </div>
        </div>

        <!-- 底部三按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-action btn-back" @click="navigateTo('/')">返回</button>
          <button type="button" class="btn-action btn-draft">存草稿</button>
          <button type="submit" class="btn-action btn-submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '确认提交' }}
          </button>
        </div>

        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
usePageSeo({ title: '留言信箱', description: '欢迎留言献策，您的每一条意见都将被认真对待。' })

const router = useRouter()
const categories = ['交流', '提供经验', '信息', '项目合作建议', '考察交流']

const userInfo = reactive({ realName: '', phone: '' })
const form = reactive({ category: '', title: '', content: '' })
const files = ref([])
const fileInput = ref(null)
const titleError = ref('')
const contentLength = ref(0)
const submitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// 检查登录状态
onMounted(() => {
  const token = localStorage.getItem('user_token')
  const infoStr = localStorage.getItem('user_info')
  if (!token) {
    navigateTo('/login?redirect=/message')
    return
  }
  if (infoStr) {
    try {
      const info = JSON.parse(infoStr)
      userInfo.realName = info.realName || ''
      userInfo.phone = info.phone || ''
    } catch {}
  }
})

function validateTitle() {
  const val = form.title
  if (val.length === 0) { titleError.value = '必填项不能为空'; return }
  if (val.length > 22) { titleError.value = '标题不能超过22字'; return }
  if (/[@#$%^&*]/.test(val)) { titleError.value = '请勿填写特殊符号'; return }
  titleError.value = ''
}

function triggerUpload() { fileInput.value?.click() }

function onFileChange(e) {
  const selected = Array.from(e.target.files || [])
  const remaining = 5 - files.value.length
  const toAdd = selected.slice(0, remaining)
  for (const f of toAdd) {
    if (f.size > 50 * 1024 * 1024) { errorMsg.value = '单个文件不能超过50M'; return }
    const preview = URL.createObjectURL(f)
    files.value.push({ name: f.name, preview, file: f })
  }
  e.target.value = ''
}

function removeFile(idx) {
  URL.revokeObjectURL(files.value[idx].preview)
  files.value.splice(idx, 1)
}

async function submitForm() {
  successMsg.value = ''; errorMsg.value = ''

  if (!form.category) { errorMsg.value = '请选择留言对象'; return }
  validateTitle()
  if (titleError.value) { errorMsg.value = titleError.value; return }
  if (!form.content || form.content.length < 10) { errorMsg.value = '留言正文至少10个字符'; return }

  const token = localStorage.getItem('user_token')
  if (!token) { navigateTo('/login?redirect=/message'); return }

  submitting.value = true
  try {
    const res = await $fetch('/api/messages', {
      method: 'POST',
      body: {
        category: form.category,
        title: form.title,
        content: form.content
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    successMsg.value = res.message || '留言提交成功，感谢您的留言！'
    form.category = ''; form.title = ''; form.content = ''; contentLength.value = 0; files.value = []
  } catch (e) {
    errorMsg.value = e.data?.message || '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.message-page { padding: 30px 0 60px; }
.back-link { font-size: 14px; color: var(--color-accent); display: inline-flex; align-items: center; margin-bottom: 16px; min-height: 44px; }
.back-link:hover { opacity: 0.7; }
.page-title { font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 30px; }

/* 区块卡片 */
.block-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 20px;
}

/* 用户信息 */
.user-info-bar { display: flex; gap: 40px; }
.user-info-item { display: flex; align-items: center; gap: 6px; }
.info-label { font-size: 14px; color: var(--color-text-secondary); white-space: nowrap; }
.info-input {
  padding: 6px 10px; font-size: 14px; border: none; border-radius: var(--radius-sm);
  background: var(--color-bg-light); color: var(--color-text-secondary); width: 160px;
}
.info-input.locked { cursor: not-allowed; }

/* 表单行 */
.form-row { display: flex; margin-bottom: 20px; }
.form-row:last-child { margin-bottom: 0; }
.row-label {
  width: 90px; flex-shrink: 0; font-size: 14px; font-weight: 600; color: var(--color-text);
  padding-top: 10px;
}
.required { color: var(--color-accent); }
.row-field { flex: 1; position: relative; }

.form-select {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 14px; background: var(--color-bg);
  outline: none; transition: border-color var(--transition-fast);
}
.form-select:focus { border-color: var(--color-accent); }

.form-input {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 14px; outline: none;
  transition: border-color var(--transition-fast);
}
.form-input:focus { border-color: var(--color-accent); }

.title-input { border-color: var(--color-accent); }
.title-input.input-error { border-color: var(--color-error); }

.field-error { font-size: 12px; color: var(--color-error); margin-top: 4px; }

.form-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 14px; outline: none; resize: vertical;
  transition: border-color var(--transition-fast);
}
.form-textarea:focus { border-color: var(--color-accent); }

.char-count {
  position: absolute; bottom: 8px; right: 14px; font-size: 12px; color: var(--color-text-muted);
}

/* 上传区域 */
.upload-area { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.upload-box {
  width: 120px; height: 120px; border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm); display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: border-color var(--transition-fast);
  flex-shrink: 0;
}
.upload-box:hover { border-color: var(--color-accent); }
.upload-plus { font-size: 36px; color: var(--color-text-muted); }

.upload-thumb { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-sm); }
.thumb-remove {
  position: absolute; top: -8px; right: -8px; width: 22px; height: 22px;
  border-radius: 50%; background: var(--color-error); color: var(--color-on-accent); font-size: 14px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}

.upload-hint { font-size: 12px; color: var(--color-text-muted); margin-top: 4px; }

/* 按钮区 */
.form-actions { display: flex; justify-content: center; gap: 16px; margin-top: 24px; }
.btn-action {
  padding: 10px 32px; font-size: 15px; border-radius: var(--radius-sm); cursor: pointer;
  transition: all var(--transition-fast); min-height: 44px; min-width: 120px;
}
.btn-back { border: 1px solid var(--color-border); color: var(--color-text); background: var(--color-bg); }
.btn-back:hover { border-color: var(--color-accent); color: var(--color-accent); }
.btn-draft { border: 1px solid var(--color-border); color: var(--color-text); background: var(--color-bg); }
.btn-draft:hover { border-color: var(--color-accent); color: var(--color-accent); }
.btn-submit { background: var(--color-accent); color: var(--color-on-accent); border: none; font-weight: 600; }
.btn-submit:hover { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.success-msg { margin-top: 16px; text-align: center; color: var(--color-success); font-size: 14px; }
.error-msg { margin-top: 16px; text-align: center; color: var(--color-error); font-size: 14px; }

@media (max-width: 767px) {
  .form-row { flex-direction: column; }
  .row-label { width: auto; margin-bottom: 4px; }
  .user-info-bar { flex-direction: column; gap: 12px; }
  .form-actions { flex-wrap: wrap; }
  .btn-action { flex: 1; min-width: 80px; padding: 10px 16px; }
}
</style>
