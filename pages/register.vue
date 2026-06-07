<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">用户注册</h1>

      <!-- 进度指示器 -->
      <div class="steps-bar">
        <div class="step" :class="{ active: currentStep >= 1, done: currentStep > 1 }">
          <span class="step-num">1</span>
          <span class="step-label">验证手机</span>
        </div>
        <div class="step-line" :class="{ filled: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, done: currentStep > 2 }">
          <span class="step-num">2</span>
          <span class="step-label">填写信息</span>
        </div>
        <div class="step-line" :class="{ filled: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3, done: currentStep >= 3 }">
          <span class="step-num">3</span>
          <span class="step-label">注册成功</span>
        </div>
      </div>

      <!-- 第一步：验证手机号 -->
      <div v-if="currentStep === 1">
        <div class="form-group">
          <label class="form-label">手机号</label>
          <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" maxlength="11">
        </div>
        <div class="form-group sms-row">
          <label class="form-label">验证码</label>
          <div class="sms-input-row">
            <input v-model="smsCode" type="text" class="form-input" placeholder="请输入验证码" maxlength="6">
            <button type="button" class="sms-btn" :disabled="smsCountdown > 0" @click="sendSms">
              {{ smsCountdown > 0 ? `${smsCountdown}s后可重发` : '发送验证码' }}
            </button>
          </div>
        </div>
        <p v-if="msg" class="hint-msg">{{ msg }}</p>
        <button class="btn-submit" :disabled="step1Loading" @click="verifyPhone">
          {{ step1Loading ? '验证中...' : '下一步' }}
        </button>
      </div>

      <!-- 第二步：填写账号信息 -->
      <div v-if="currentStep === 2">
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-input" placeholder="请输入密码（至少6位）">
        </div>
        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input v-model="confirmPwd" type="password" class="form-input" placeholder="请再次输入密码">
        </div>
        <div class="form-group">
          <label class="form-label">真实姓名</label>
          <input v-model="realName" type="text" class="form-input" placeholder="请输入真实姓名">
        </div>
        <div class="form-group">
          <label class="form-label">身份证号</label>
          <input v-model="idCard" type="text" class="form-input" placeholder="请输入身份证号">
        </div>
        <p v-if="msg" class="hint-msg error-msg-text">{{ msg }}</p>
        <button class="btn-submit" :disabled="step2Loading" @click="submitRegister">
          {{ step2Loading ? '提交中...' : '下一步' }}
        </button>
      </div>

      <!-- 第三步：注册成功 -->
      <div v-if="currentStep === 3" class="success-step">
        <div class="success-icon">✓</div>
        <h2 class="success-title">注册成功</h2>
        <p class="success-hint">{{ countdown }}s 后自动跳转至留言页</p>
      </div>

      <p class="auth-switch">
        已有账号？<NuxtLink to="/login" class="auth-link">立即登录</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
usePageSeo({ title: '用户注册', description: '注册中国—东盟气候智慧型热带农业协同平台账号', noindex: true })

const currentStep = ref(1)
const phone = ref('')
const smsCode = ref('')
const password = ref('')
const confirmPwd = ref('')
const realName = ref('')
const idCard = ref('')
const smsCountdown = ref(0)
const msg = ref('')
const step1Loading = ref(false)
const step2Loading = ref(false)
const countdown = ref(2)
let smsTimer = null

async function sendSms() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) { msg.value = '请输入有效的手机号'; return }
  msg.value = ''
  try {
    const res = await $fetch('/api/auth/send-sms', { method: 'POST', body: { phone: phone.value } })
    console.log('验证码:', res.data?.code) // 控制台查看
    msg.value = `验证码已发送至 ${phone.value}（请查看控制台日志）`
    smsCountdown.value = 60
    smsTimer = setInterval(() => { smsCountdown.value--; if (smsCountdown.value <= 0) clearInterval(smsTimer) }, 1000)
  } catch (e) { msg.value = e.data?.message || '发送失败' }
}

async function verifyPhone() {
  if (!phone.value || !smsCode.value) { msg.value = '请填写手机号和验证码'; return }
  step1Loading.value = true; msg.value = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { step: 1, phone: phone.value, code: smsCode.value } })
    currentStep.value = 2
    msg.value = ''
  } catch (e) { msg.value = e.data?.message || '验证失败' }
  finally { step1Loading.value = false }
}

async function submitRegister() {
  if (!password.value || password.value.length < 6) { msg.value = '密码长度至少6位'; return }
  if (password.value !== confirmPwd.value) { msg.value = '两次输入的密码不一致'; return }
  if (!realName.value) { msg.value = '请输入真实姓名'; return }
  if (!idCard.value) { msg.value = '请输入身份证号'; return }
  step2Loading.value = true; msg.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { step: 2, phone: phone.value, password: password.value, real_name: realName.value, id_card: idCard.value }
    })
    currentStep.value = 3
    // 自动跳转
    const timer = setInterval(() => { countdown.value--; if (countdown.value <= 0) { clearInterval(timer); navigateTo('/message') } }, 1000)
  } catch (e) { msg.value = e.data?.message || '注册失败' }
  finally { step2Loading.value = false }
}

onUnmounted(() => { if (smsTimer) clearInterval(smsTimer) })
</script>

<style scoped>
.auth-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-card {
  width: 460px;
  max-width: 100%;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 40px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}

.auth-title { font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px; }

/* 步骤条 */
.steps-bar { display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
.step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.step-num {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; border: 2px solid var(--color-border); color: var(--color-text-muted);
  transition: all var(--transition-normal);
}
.step-label { font-size: 12px; color: var(--color-text-muted); }
.step.active .step-num { border-color: var(--color-accent); color: var(--color-accent); }
.step.active .step-label { color: var(--color-accent); }
.step.done .step-num { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-on-accent); }
.step.done .step-label { color: var(--color-accent); }
.step-line { flex: 1; height: 2px; background: var(--color-border); margin: 0 8px; transition: background var(--transition-normal); }
.step-line.filled { background: var(--color-accent); }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: var(--color-text); }
.form-input {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 14px; outline: none;
  transition: border-color var(--transition-fast);
}
.form-input:focus { border-color: var(--color-accent); }

.sms-input-row { display: flex; gap: 10px; }
.sms-input-row .form-input { flex: 1; }
.sms-btn {
  padding: 10px 16px; font-size: 13px; white-space: nowrap; border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm); color: var(--color-accent); cursor: pointer;
  transition: all var(--transition-fast); min-height: 44px;
}
.sms-btn:hover { background: var(--color-accent); color: var(--color-on-accent); }
.sms-btn:disabled { border-color: var(--color-border); color: var(--color-text-muted); cursor: not-allowed; }

.hint-msg { font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px; }
.error-msg-text { color: var(--color-error); }

.btn-submit {
  width: 100%; padding: 12px; background: var(--color-accent); color: var(--color-on-accent);
  font-size: 16px; font-weight: 600; border-radius: var(--radius-sm); cursor: pointer;
  transition: opacity var(--transition-fast); margin-top: 8px; min-height: 44px;
}
.btn-submit:hover { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* 成功页 */
.success-step { text-align: center; padding: 24px 0; }
.success-icon {
  width: 64px; height: 64px; border-radius: 50%; background: var(--color-success);
  color: var(--color-on-accent); font-size: 32px; display: flex; align-items: center;
  justify-content: center; margin: 0 auto 16px;
}
.success-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.success-hint { font-size: 14px; color: var(--color-text-muted); }

.auth-switch { margin-top: 20px; text-align: center; font-size: 14px; color: var(--color-text-secondary); }
.auth-link { color: var(--color-accent); margin-left: 4px; }
.auth-link:hover { text-decoration: underline; }

@media (max-width: 767px) {
  .auth-card { padding: 24px; }
}
</style>
