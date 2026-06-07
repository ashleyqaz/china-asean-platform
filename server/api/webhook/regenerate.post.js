// CMS 内容更新 Webhook — 管理员修改内容后，调用此接口触发重新生成静态站点
// 用法：POST /api/v1/webhook/regenerate
// Body: { "secret": "your-webhook-secret" }
// 部署时配合 CI/CD（如 GitHub Actions）执行 nuxt generate 并推送至 CDN

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const webhookSecret = process.env.WEBHOOK_SECRET || 'china-asean-webhook-secret-2026'

  if (body.secret !== webhookSecret) {
    throw createError({ statusCode: 403, message: '无效的密钥' })
  }

  // 触发重新生成（实际部署中由外部 CI/CD 执行）
  // 这里返回一个触发信号，实际生成命令为: nuxt generate && rsync -avz .output/public/ /var/www/html/
  const timestamp = new Date().toISOString()

  return {
    code: 200,
    message: '已接收重新生成请求，静态站点将在 CI/CD 流水线中重新构建。',
    data: {
      trigger_time: timestamp,
      command: 'nuxt generate',
      note: '此接口仅作为通知端点，实际构建由 CI/CD 系统执行。请确保 CI/CD 已配置 webhook 监听。'
    }
  }
})
