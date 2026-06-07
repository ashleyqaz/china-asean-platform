<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">用户登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">手机号</label>
          <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" maxlength="11" autocomplete="tel">
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-input" placeholder="请输入密码" autocomplete="current-password">
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>
      <p class="auth-switch">
        没有账号？<NuxtLink to="/register" class="auth-link">立即注册</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
usePageSeo({ title: '用户登录', description: '登录中国—东盟气候智慧型热带农业协同平台', noindex: true })

const phone = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!phone.value || !password.value) { errorMsg.value = '请输入手机号和密码'; return }
  loading.value = true; errorMsg.value = ''
  try {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: { phone: phone.value, password: password.value } })
    localStorage.setItem('user_token', res.data.token)
    localStorage.setItem('user_info', JSON.stringify(res.data.user))
    // 跳转到留言页或来源页
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/message'
    navigateTo(redirect)
  } catch (e) {
    errorMsg.value = e.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
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
  width: 400px;
  max-width: 100%;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 40px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: var(--color-text);
}

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: var(--color-text); }

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  transition: border-color var(--transition-fast);
}
.form-input:focus { border-color: var(--color-accent); }

.btn-submit {
  width: 100%;
  padding: 12px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity var(--transition-fast);
  margin-top: 8px;
  min-height: 44px;
}
.btn-submit:hover { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.error-msg { margin-top: 16px; text-align: center; color: var(--color-error); font-size: 14px; }

.auth-switch { margin-top: 20px; text-align: center; font-size: 14px; color: var(--color-text-secondary); }
.auth-link { color: var(--color-accent); margin-left: 4px; }
.auth-link:hover { text-decoration: underline; }

@media (max-width: 767px) {
  .auth-card { padding: 24px; }
}
</style>
