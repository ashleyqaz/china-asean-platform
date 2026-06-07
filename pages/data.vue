<template>
  <div class="page">
    <div class="container">
      <nav class="breadcrumb"><NuxtLink to="/">{{ t('breadcrumb.home') }}</NuxtLink><span> &gt; </span><span>{{ t('dataPage.title') }}</span></nav>
      <h1 class="page-title">{{ t('dataPage.title') }}</h1>
      <div class="chart-grid">
        <div class="chart-card">
          <h3>东盟各国热带农业碳排放趋势（万吨）</h3>
          <canvas ref="chart1"></canvas>
        </div>
        <div class="chart-card">
          <h3>示范基地产量对比（吨/公顷）</h3>
          <canvas ref="chart2"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
definePageMeta({ layout: 'default' })
usePageSeo({ title: computed(() => t('dataPage.title')), description: computed(() => t('dataPage.desc')) })

const chart1 = ref(null)
const chart2 = ref(null)

onMounted(async () => {
  // 动态导入 Chart.js
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  if (chart1.value) {
    new Chart(chart1.value, {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
          { label: '印度尼西亚', data: [420, 435, 450, 445, 460, 455, 448], borderColor: '#b87235', tension: 0.3 },
          { label: '泰国', data: [280, 290, 295, 300, 310, 305, 298], borderColor: '#c9985e', tension: 0.3 },
          { label: '越南', data: [200, 215, 230, 240, 245, 238, 230], borderColor: '#8b6f4e', tension: 0.3 },
          { label: '马来西亚', data: [180, 185, 190, 188, 195, 190, 185], borderColor: '#d4a853', tension: 0.3 }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    })
  }

  if (chart2.value) {
    new Chart(chart2.value, {
      type: 'bar',
      data: {
        labels: ['水稻', '玉米', '甘蔗', '香蕉', '橡胶'],
        datasets: [
          { label: '示范基地', data: [8.5, 7.2, 95, 42, 2.8], backgroundColor: '#b87235' },
          { label: '传统种植', data: [6.3, 5.1, 72, 35, 2.1], backgroundColor: '#d9d0c1' }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    })
  }
})
</script>

<style scoped>
.page { padding: 30px 0 60px; min-height: 60vh; }
.breadcrumb { font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px; }
.breadcrumb a { color: var(--color-accent); }
.page-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; }
.chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.chart-card { background: var(--color-bg); border-radius: var(--radius-md); padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
.chart-card h3 { font-size: 16px; text-align: center; margin-bottom: 16px; color: var(--color-text); }
.chart-card canvas { max-height: 350px; }
@media (max-width: 767px) { .chart-grid { grid-template-columns: 1fr; } }
</style>
