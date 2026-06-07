<template>
  <header class="admin-topbar">
    <div class="topbar-inner">
      <div class="topbar-left">
        <span class="topbar-brand">管理后台</span>
      </div>

      <div class="topbar-spacer"></div>

      <div class="topbar-actions">
        <!-- 消息铃铛 + 红色角标 -->
        <button class="topbar-btn" title="消息通知" @click="goMessages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        </button>

        <!-- 主题切换图标 + 下拉菜单 -->
        <div class="theme-menu" ref="themeMenuRef">
          <button class="topbar-btn" title="主题切换" @click="showThemeMenu = !showThemeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <div v-if="showThemeMenu" class="theme-dropdown">
            <button
              v-for="opt in themeOptions"
              :key="opt.key"
              class="dropdown-item"
              :class="{ active: currentTheme === opt.key }"
              @click="setTheme(opt.key)"
            >
              <span class="theme-icon">{{ opt.icon }}</span>
              <span>{{ opt.label }}</span>
              <span v-if="currentTheme === opt.key" class="check">✓</span>
            </button>
          </div>
        </div>

        <!-- 管理员昵称下拉 -->
        <div class="user-menu" ref="userMenuRef">
          <button class="topbar-btn user-btn" @click="showUserMenu = !showUserMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="user-name">{{ adminName }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="showUserMenu" class="user-dropdown">
            <button class="dropdown-item" @click="goSettings">系统设置</button>
            <button class="dropdown-item" @click="goSite">查看前台</button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" @click="logout">退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const showUserMenu = ref(false)
const showThemeMenu = ref(false)
const unreadCount = ref(0)
const adminName = ref('Admin')
const userMenuRef = ref(null)
const themeMenuRef = ref(null)

const currentTheme = ref('light')

const themeOptions = [
  { key: 'light', label: '浅色模式', icon: '☀️' },
  { key: 'dark', label: '深色模式', icon: '🌙' },
  { key: 'auto', label: '自动跟随系统', icon: '💻' }
]

function setTheme(key) {
  currentTheme.value = key
  showThemeMenu.value = false
}

function goMessages() {
  navigateTo('/admin/messages')
}

function goSettings() {
  showUserMenu.value = false
  navigateTo('/admin/settings')
}

function goSite() {
  window.open('/', '_blank')
}

function logout() {
  showUserMenu.value = false
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_username')
  navigateTo('/admin/login')
}

function onClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    showUserMenu.value = false
  }
  if (themeMenuRef.value && !themeMenuRef.value.contains(e.target)) {
    showThemeMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onClickOutside)
  adminName.value = localStorage.getItem('admin_username') || 'Admin'

  const token = localStorage.getItem('admin_token')
  if (token) {
    try {
      const res = await $fetch('/api/admin/messages', {
        params: { status: 'unread', size: 1 },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.code === 200) unreadCount.value = res.data?.total || 0
    } catch {}
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  height: 52px;
}

.topbar-inner {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  gap: 16px;
}

.topbar-left {
  width: 200px;
  flex-shrink: 0;
}

.topbar-brand {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.topbar-spacer {
  flex: 1;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.topbar-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 8px;
  color: #666666;
  cursor: pointer;
  transition: all 0.15s ease;
}

.topbar-btn:hover {
  background: #f5f5f5;
  color: #333333;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  background: #e74c3c;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

.user-btn {
  width: auto;
  padding: 0 10px;
  gap: 6px;
}

.user-name {
  font-size: 13px;
  color: #333333;
  font-weight: 500;
}

.user-menu,
.theme-menu {
  position: relative;
}

.user-dropdown,
.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 160px;
  overflow: hidden;
  z-index: 300;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  text-align: left;
  border: none;
  background: none;
  color: #555555;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.active {
  color: #1a6fb5;
  font-weight: 600;
}

.theme-icon {
  font-size: 14px;
}

.check {
  margin-left: auto;
  font-size: 12px;
  color: #1a6fb5;
}

.dropdown-item.logout {
  color: #d9534f;
}

.dropdown-item.logout:hover {
  background: #fef5f5;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
}

@media (max-width: 767px) {
  .topbar-left {
    width: 140px;
  }
  .topbar-brand {
    font-size: 13px;
  }
  .user-name {
    display: none;
  }
}
</style>
