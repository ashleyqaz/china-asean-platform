<template>
  <div class="admin-shell">
    <AdminSidebar />

    <!-- 主内容区 -->
    <main class="admin-main">
      <h1 class="dashboard-title">首页概览</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.newsCount }}</span>
          <span class="stat-label">资讯总数</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.carouselCount }}</span>
          <span class="stat-label">轮播图</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.unitCount }}</span>
          <span class="stat-label">支撑单位</span>
        </div>
        <div class="stat-card">
          <span class="stat-num" :class="{ 'stat-warn': stats.unreadCount > 0 }">{{ stats.unreadCount }}</span>
          <span class="stat-label">未读留言</span>
        </div>
      </div>

      <!-- 三栏等分信息卡片 -->
      <div class="info-cards-row">
        <!-- 系统公告 -->
        <div class="info-card">
          <div class="info-card-head">
            <h3 class="info-card-title">系统公告</h3>
            <div class="filter-tags">
              <button
                v-for="tag in noticeFilters"
                :key="tag.key"
                class="filter-tag"
                :class="{ active: activeFilter === tag.key }"
                @click="activeFilter = tag.key"
              >{{ tag.label }}</button>
            </div>
          </div>
          <ul class="notice-list">
            <li v-for="item in filteredNotices" :key="item.id" class="notice-item">
              <span class="status-dot" :class="item.status"></span>
              <span class="notice-title">{{ item.title }}</span>
              <span class="notice-time">{{ item.time }}</span>
            </li>
            <li v-if="filteredNotices.length === 0" class="notice-empty">暂无公告</li>
          </ul>
        </div>

        <!-- 操作日志 -->
        <div class="info-card">
          <div class="info-card-head">
            <h3 class="info-card-title">操作日志</h3>
          </div>
          <ul class="log-list">
            <li v-for="log in operationLogs" :key="log.id" class="log-item">
              <span class="log-user">{{ log.user }}</span>
              <span class="log-action">{{ log.action }}</span>
              <span class="log-time">{{ log.time }}</span>
            </li>
            <li v-if="operationLogs.length === 0" class="notice-empty">暂无日志</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const stats = reactive({
  newsCount: 0,
  carouselCount: 0,
  unitCount: 0,
  unreadCount: 0
})

onMounted(async () => {
  const token = localStorage.getItem('admin_token')
  if (!token) { navigateTo('/admin/login'); return }

  try {
    const [newsRes, carouselRes, unitsRes, msgsRes] = await Promise.all([
      $fetch('/api/admin/news', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/admin/carousel', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/admin/support-units', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/admin/messages', { params: { status: 'unread', size: 1 }, headers: { Authorization: `Bearer ${token}` } })
    ])
    stats.newsCount = newsRes.data?.total || 0
    stats.carouselCount = carouselRes.data?.length || 0
    stats.unitCount = unitsRes.data?.length || 0
    stats.unreadCount = msgsRes.data?.total || 0
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
})

// 操作日志
const operationLogs = ref([
  { id: 1, user: 'admin', action: '新增资讯《气候智慧型农业技术推广方案》', time: '2026-06-06 14:22' },
  { id: 2, user: 'admin', action: '更新轮播图 Banner-2', time: '2026-06-06 11:15' },
  { id: 3, user: 'admin', action: '回复留言 #1032（项目合作咨询）', time: '2026-06-05 16:48' },
  { id: 4, user: 'admin', action: '修改系统设置-联系信息', time: '2026-06-05 10:30' },
  { id: 5, user: 'admin', action: '删除过期轮播图 Banner-5', time: '2026-06-04 09:12' }
])

// 系统公告
const noticeFilters = [
  { key: 'all', label: '默认' },
  { key: 'active', label: '进行中' },
  { key: 'success', label: '成功' },
  { key: 'warning', label: '警告' },
  { key: 'error', label: '异常' }
]
const activeFilter = ref('all')

const notices = ref([
  { id: 1, title: '系统版本更新至 v2.1.0，新增数据导出功能', time: '2026-06-06 10:30', status: 'success' },
  { id: 2, title: '数据库例行维护通知：本周六凌晨 2:00-4:00', time: '2026-06-05 16:00', status: 'warning' },
  { id: 3, title: '新增 3 篇气候智慧型农业技术资讯', time: '2026-06-04 09:15', status: 'green' },
  { id: 4, title: '文件上传服务暂不可用，正在修复中', time: '2026-06-03 14:20', status: 'error' },
  { id: 5, title: '平台用户手册已更新，请查阅最新版本', time: '2026-06-02 11:00', status: 'green' }
])

const filteredNotices = computed(() => {
  if (activeFilter.value === 'all') return notices.value
  return notices.value.filter(n => n.status === activeFilter.value)
})

useHead({ title: '管理后台 - 首页概览' })
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  padding: 28px 32px;
  background: #f9fafb;
  min-height: 100vh;
}

.dashboard-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.stat-num {
  display: block;
  font-size: 34px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.stat-num.stat-warn {
  color: #d9534f;
}

.stat-label {
  font-size: 13px;
  color: #888888;
}

/* 三栏信息卡片 */
.info-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.info-card-head {
  padding: 16px 18px 12px;
  border-bottom: 1px solid #f5f5f5;
}

.info-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

/* 筛选标签 */
.filter-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 3px 10px;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  color: #777777;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.filter-tag:hover {
  border-color: #1a6fb5;
  color: #1a6fb5;
}

.filter-tag.active {
  background: #1a6fb5;
  border-color: #1a6fb5;
  color: #ffffff;
}

/* 公告列表 */
.notice-list {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-bottom: 1px solid #f9f9f9;
  font-size: 13px;
}

.notice-item:last-child {
  border-bottom: none;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #cccccc;
}

.status-dot.green { background: #52c41a; }
.status-dot.success { background: #52c41a; }
.status-dot.warning { background: #faad14; }
.status-dot.error { background: #ff4d4f; }
.status-dot.gray { background: #cccccc; }

.notice-title {
  flex: 1;
  color: #555555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  font-size: 11px;
  color: #aaaaaa;
  flex-shrink: 0;
}

.notice-empty {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #cccccc;
}

/* 操作日志 */
.log-list {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-bottom: 1px solid #f9f9f9;
  font-size: 13px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-user {
  font-weight: 600;
  color: #1a6fb5;
  flex-shrink: 0;
  min-width: 52px;
}

.log-action {
  flex: 1;
  color: #555555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.log-time {
  font-size: 11px;
  color: #aaaaaa;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .info-cards-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .admin-main {
    padding: 20px 16px;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>
