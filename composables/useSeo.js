// 页面 SEO 工具 — 每个页面调用以注入独立的 title / description / OG 标签
export function usePageSeo(options) {
  const baseTitle = '中国—东盟气候智慧型热带农业协同平台'
  const title = options.title ? `${options.title} - ${baseTitle}` : baseTitle
  const description = options.description || '中国—东盟气候智慧型热带农业协同平台，致力于推动气候智慧型热带农业技术交流与合作，促进区域农业可持续发展。'

  const meta = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description }
  ]

  if (options.ogImage) {
    meta.push({ property: 'og:image', content: options.ogImage })
  }

  if (options.noindex) {
    meta.push({ name: 'robots', content: 'noindex' })
  } else {
    meta.push({ name: 'robots', content: 'index, follow' })
  }

  useHead({ title, meta })
}

// 结构化数据（JSON-LD），用于搜索引擎富文本展示
export function useJsonLd(type, data) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data })
      }
    ]
  })
}
