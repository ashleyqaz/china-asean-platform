<template>
  <aside class="admin-sidebar">
    <h2 class="sidebar-title">管理后台</h2>
    <nav class="sidebar-nav">
      <NuxtLink to="/admin" class="nav-link" :class="{ active: isActive('/admin') }">首页概览</NuxtLink>
      <NuxtLink to="/admin/nav-menus" class="nav-link" :class="{ active: isActive('/admin/nav-menus') }">导航菜单</NuxtLink>
      <NuxtLink to="/admin/category-content" class="nav-link" :class="{ active: isActive('/admin/category-content') }">栏目内容</NuxtLink>
      <NuxtLink to="/admin/carousel" class="nav-link" :class="{ active: isActive('/admin/carousel') }">轮播图管理</NuxtLink>
      <NuxtLink to="/admin/news" class="nav-link" :class="{ active: isActive('/admin/news') }">资讯管理</NuxtLink>
      <NuxtLink to="/admin/units" class="nav-link" :class="{ active: isActive('/admin/units') }">支撑单位</NuxtLink>
      <NuxtLink to="/admin/about" class="nav-link" :class="{ active: isActive('/admin/about') }">关于我们</NuxtLink>
      <NuxtLink to="/admin/downloads" class="nav-link" :class="{ active: isActive('/admin/downloads') }">资料下载</NuxtLink>
      <NuxtLink to="/admin/experts" class="nav-link" :class="{ active: isActive('/admin/experts') }">专家管理</NuxtLink>
      <NuxtLink to="/admin/projects" class="nav-link" :class="{ active: isActive('/admin/projects') }">合作项目</NuxtLink>
      <NuxtLink to="/admin/messages" class="nav-link" :class="{ active: isActive('/admin/messages') }">留言管理</NuxtLink>
      <NuxtLink to="/admin/subscribers" class="nav-link" :class="{ active: isActive('/admin/subscribers') }">邮件订阅</NuxtLink>
      <NuxtLink to="/admin/settings" class="nav-link" :class="{ active: isActive('/admin/settings') }">系统设置</NuxtLink>
      <a href="/" target="_blank" class="nav-link external">查看前台 →</a>
      <button class="nav-link logout-btn" @click="logout">退出登录</button>
    </nav>
  </aside>
</template>

<script setup>
const route = useRoute()

function isActive(path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_username')
  navigateTo('/admin/login')
}
</script>

<style scoped>
.admin-sidebar {
  width: 220px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  border-right: 1px solid #e8e8e8;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  padding: 22px 20px;
  text-align: center;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  font-size: 14px;
  color: #555555;
  transition: all 0.15s ease;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  font-family: inherit;
  border-left: 3px solid transparent;
}

.nav-icon {
  font-size: 15px;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.nav-link:hover {
  background: #f5f8fc;
  color: #333333;
}

.nav-link.active {
  background: #e8f1fb;
  color: #1a6fb5;
  font-weight: 600;
  border-left-color: #1a6fb5;
}

.nav-link.external {
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
  color: #888888;
}

.logout-btn {
  color: #999999;
  border-top: 1px solid #f0f0f0;
}

.logout-btn:hover {
  color: #d9534f;
  background: #fef5f5;
}

@media (max-width: 767px) {
  .admin-sidebar {
    width: 160px;
  }
  .nav-link {
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
