<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">管理后台登录</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="username" type="text" class="form-input" autocomplete="username">
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-input" autocomplete="current-password">
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin-login' })

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    localStorage.setItem('admin_token', res.data.token)
    localStorage.setItem('admin_username', res.data.username)
    navigateTo('/admin')
  } catch (e) {
    errorMsg.value = e.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}

useHead({ title: '管理后台登录', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-light);
}

.login-card {
  background: var(--color-bg);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  width: 380px;
  max-width: 90vw;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  border-color: var(--color-accent);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity var(--transition-fast);
  min-height: 44px;
}

.login-btn:hover { opacity: 0.9; }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.error-msg {
  margin-top: 16px;
  text-align: center;
  color: var(--color-error);
  font-size: 14px;
}
</style>
