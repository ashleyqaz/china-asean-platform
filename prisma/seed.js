import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hash(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  console.log('Seeding database...')

  // ===== 管理员 =====
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', passwordHash: hash('admin123') }
  })

  // ===== 示例用户 =====
  await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      phone: '13800138000',
      passwordHash: hash('123456'),
      realName: '张三',
      idCard: '110101199001011234'
    }
  })

  // ===== 导航菜单 (8个，第7项高亮) =====
  const navItems = [
    { name: '农业应对气候变化', slug: 'agriculture-climate-response', sortOrder: 1, isHighlight: false },
    { name: '农业应对气候变化政策体系', slug: 'climate-policy-system', sortOrder: 2, isHighlight: false },
    { name: '国际组织相关动态', slug: 'international-org-updates', sortOrder: 3, isHighlight: false },
    { name: '中国—东盟国家相关动态', slug: 'china-asean-updates', sortOrder: 4, isHighlight: false },
    { name: '绿色低碳农业', slug: 'green-low-carbon-agriculture', sortOrder: 5, isHighlight: false },
    { name: '气候智慧型热带农业技术与典型经验', slug: 'climate-smart-tech-experience', sortOrder: 6, isHighlight: false },
    { name: '气候变化与热带农产品绿色贸易壁垒', slug: 'green-trade-barriers', sortOrder: 7, isHighlight: false },
    { name: '经验技术交流学习互动', slug: 'tech-exchange-interaction', sortOrder: 8, isHighlight: false }
  ]
  for (const item of navItems) {
    await prisma.navMenu.upsert({ where: { slug: item.slug }, update: item, create: item })
  }

  // ===== 轮播图 (3张，含图注) =====
  const carouselItems = [
    { imageUrl: '/images/banner1.svg', title: '气候智慧型热带农业', caption: '推动热带农业绿色低碳转型', sortOrder: 1 },
    { imageUrl: '/images/banner2.svg', title: '中国—东盟农业合作', caption: '深化区域农业科技交流与合作', sortOrder: 2 },
    { imageUrl: '/images/banner3.svg', title: '绿色低碳农业技术推广', caption: '构建气候智慧型农业技术体系', sortOrder: 3 }
  ]
  // 先清空轮播图表
  await prisma.carouselItem.deleteMany()
  for (const item of carouselItems) {
    await prisma.carouselItem.create({ data: item })
  }

  // ===== 支撑单位分类（先清空再创建，避免重复） =====
  await prisma.supportUnit.deleteMany()
  await prisma.unitCategory.deleteMany()
  const categories = [
    { name: '院属单位', sortOrder: 1 },
    { name: '管理机构', sortOrder: 2 },
    { name: '重要平台', sortOrder: 3 }
  ]
  for (const cat of categories) {
    await prisma.unitCategory.create({ data: cat })
  }

  // ===== 支撑单位 =====
  const savedCats = await prisma.unitCategory.findMany({ orderBy: { sortOrder: 'asc' } })
  const units = [
    { categoryId: savedCats[0].id, name: '中国热带农业科学院热带作物品种资源研究所', sortOrder: 1, websiteUrl: 'https://www.catas.cn' },
    { categoryId: savedCats[0].id, name: '中国热带农业科学院橡胶研究所', sortOrder: 2, websiteUrl: 'https://www.catas.cn' },
    { categoryId: savedCats[0].id, name: '中国热带农业科学院南亚热带作物研究所', sortOrder: 3, websiteUrl: 'https://www.catas.cn' },
    { categoryId: savedCats[1].id, name: '农业农村部热带作物及制品标准化技术委员会', sortOrder: 1 },
    { categoryId: savedCats[1].id, name: '中国热带农业科学院国际合作处', sortOrder: 2 },
    { categoryId: savedCats[2].id, name: '国家热带农业科技创新中心', sortOrder: 1 },
    { categoryId: savedCats[2].id, name: '热带农业国际联合研究中心', sortOrder: 2 },
    { categoryId: savedCats[2].id, name: '中国—东盟热带农业技术转移中心', sortOrder: 3 }
  ]
  for (const unit of units) {
    await prisma.supportUnit.create({ data: unit })
  }

  // ===== 联系信息 =====
  const contactData = [
    { keyName: 'address', value: '海南省海口市龙华区学院路4号海南大学城西校区内，570003' },
    { keyName: 'phone', value: '0898 6696 9289' },
    { keyName: 'email', value: 'contact@example.com' },
    { keyName: 'fax', value: '0898 6696 9289' },
    { keyName: 'header_note', value: '' }
  ]
  for (const item of contactData) {
    await prisma.contactInfo.upsert({
      where: { keyName: item.keyName },
      update: item,
      create: item
    })
  }

  // ===== 二维码 =====
  await prisma.qrcodeConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, imageUrl: '/images/qrcode-placeholder.svg' }
  })

  // ===== 站点配置 =====
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: '中国—东盟气候智慧型热带农业协同平台',
      copyrightText: '',
      icpNumber: '琼ICP备xxxxxxxx号'
    }
  })

  // ===== 子栏目（每栏目3-5个） =====
  await prisma.subCategory.deleteMany()
  const subCategories = [
    // 农业应对气候变化
    { menuSlug: 'agriculture-climate-response', name: '政策解读', sortOrder: 1 },
    { menuSlug: 'agriculture-climate-response', name: '技术推广', sortOrder: 2 },
    { menuSlug: 'agriculture-climate-response', name: '案例分享', sortOrder: 3 },
    { menuSlug: 'agriculture-climate-response', name: '国际合作', sortOrder: 4 },
    // 农业应对气候变化政策体系
    { menuSlug: 'climate-policy-system', name: '国家政策', sortOrder: 1 },
    { menuSlug: 'climate-policy-system', name: '地方实践', sortOrder: 2 },
    { menuSlug: 'climate-policy-system', name: '国际比较', sortOrder: 3 },
    { menuSlug: 'climate-policy-system', name: '政策评估', sortOrder: 4 },
    { menuSlug: 'climate-policy-system', name: '法规解读', sortOrder: 5 },
    // 国际组织相关动态
    { menuSlug: 'international-org-updates', name: 'FAO动态', sortOrder: 1 },
    { menuSlug: 'international-org-updates', name: 'WMO信息', sortOrder: 2 },
    { menuSlug: 'international-org-updates', name: 'CGIAR研究', sortOrder: 3 },
    // 中国—东盟国家相关动态
    { menuSlug: 'china-asean-updates', name: '合作进展', sortOrder: 1 },
    { menuSlug: 'china-asean-updates', name: '国别动态', sortOrder: 2 },
    { menuSlug: 'china-asean-updates', name: '论坛会议', sortOrder: 3 },
    { menuSlug: 'china-asean-updates', name: '项目成果', sortOrder: 4 },
    // 绿色低碳农业
    { menuSlug: 'green-low-carbon-agriculture', name: '减排技术', sortOrder: 1 },
    { menuSlug: 'green-low-carbon-agriculture', name: '循环农业', sortOrder: 2 },
    { menuSlug: 'green-low-carbon-agriculture', name: '碳交易', sortOrder: 3 },
    { menuSlug: 'green-low-carbon-agriculture', name: '绿色认证', sortOrder: 4 },
    // 气候智慧型热带农业技术与典型经验
    { menuSlug: 'climate-smart-tech-experience', name: '栽培技术', sortOrder: 1 },
    { menuSlug: 'climate-smart-tech-experience', name: '智能灌溉', sortOrder: 2 },
    { menuSlug: 'climate-smart-tech-experience', name: '土壤管理', sortOrder: 3 },
    { menuSlug: 'climate-smart-tech-experience', name: '病虫害防控', sortOrder: 4 },
    { menuSlug: 'climate-smart-tech-experience', name: '典型经验', sortOrder: 5 },
    // 气候变化与热带农产品绿色贸易壁垒
    { menuSlug: 'green-trade-barriers', name: '碳边境调节', sortOrder: 1 },
    { menuSlug: 'green-trade-barriers', name: '碳足迹核算', sortOrder: 2 },
    { menuSlug: 'green-trade-barriers', name: '绿色认证', sortOrder: 3 },
    { menuSlug: 'green-trade-barriers', name: '出口策略', sortOrder: 4 },
    // 经验技术交流学习互动
    { menuSlug: 'tech-exchange-interaction', name: '在线课程', sortOrder: 1 },
    { menuSlug: 'tech-exchange-interaction', name: '专家答疑', sortOrder: 2 },
    { menuSlug: 'tech-exchange-interaction', name: '经验分享', sortOrder: 3 }
  ]
  for (const sub of subCategories) {
    await prisma.subCategory.create({ data: sub })
  }

  // ===== 示例资讯：每栏目20条，日期分布一个月 =====
  await prisma.newsArticle.deleteMany()
  const newsTemplates = {
    'agriculture-climate-response': { title: '农业应对气候变化', prefixes: ['最新研究显示', '专家建议', '试点项目', '国际经验表明', '农业农村部发布', '热带地区', '气候变化背景下', '适应性措施', '我院完成', '调研报告指出', '技术指南', '示范基地', '东盟合作', '气象灾害', '品种改良', '种植结构调整', '节水灌溉', '预警体系', '能力建设', '综合评估'] },
    'climate-policy-system': { title: '政策体系', prefixes: ['国务院办公厅印发', '农业农村部出台', '国家发改委发布', '财政部安排', '生态环境部强调', '自然资源部推进', '科技部部署', '多部门联合发布', '省级层面落实', '政策解读', '实施方案', '考核办法', '补贴标准', '保险政策', '投资指南', '金融支持', '税收优惠', '法律法规', '标准制定', '监督评估'] },
    'international-org-updates': { title: '国际组织', prefixes: ['FAO发布', 'WMO报告', 'CGIAR启动', 'UNDP项目', '世界银行', '亚行研究', 'IFAD评估', 'UNEP倡议', 'GEF资助', 'GCF审批', '国际会议', '联合声明', '多边合作', '南南合作', '知识分享', '能力建设', '最佳实践', '技术转移', '监测报告', '全球展望'] },
    'china-asean-updates': { title: '中国东盟', prefixes: ['中国—东盟合作', '双边协议', '区域全面经济伙伴', '东盟秘书处', '中泰联合', '中越合作', '中柬项目', '中老铁路', '中缅农业', '菲律宾', '印度尼西亚', '马来西亚', '新加坡', '文莱', '峰会成果', '部长级会议', '工作组进展', '能力建设培训', '青年交流', '贸易便利化'] },
    'green-low-carbon-agriculture': { title: '绿色低碳', prefixes: ['低碳技术', '减排方案', '循环农业模式', '有机种植', '生物多样性', '土壤固碳', '可再生能源', '农业废弃物', '绿色投入品', '碳标签制度', '生态补偿', '清洁生产', '节能减排', '绿色发展', '碳中和路径', '零碳农场', '绿色供应链', '环境效益', '可持续发展', '综合效益分析'] },
    'climate-smart-tech-experience': { title: '技术经验', prefixes: ['高效栽培', '智能温室', '精准施肥', '无人机植保', '物联网监测', '大数据分析', 'AI辅助决策', '新品种选育', '水肥一体化', '立体种养', '农林复合', '病虫害预警', '产后处理', '冷链物流', '数字农业', '智慧果园', '设施农业', '种养循环', '生态防控', '集成示范'] },
    'green-trade-barriers': { title: '贸易壁垒', prefixes: ['碳边境调节机制', '碳足迹认证', '绿色标准', '市场准入', '技术性壁垒', '国际认证', '供应链追溯', '可持续发展报告', 'ESG要求', '公平贸易', '关税政策', '非关税措施', '合规管理', '风险预警', '应对策略', '行业影响', '企业案例', '国际规则', '谈判进展', '产业升级'] },
    'tech-exchange-interaction': { title: '交流互动', prefixes: ['线上培训', '专家讲座', '田间课堂', '技术示范', '经验交流', '成果展示', '实地考察', '国际合作', '学术研讨', '青年科学家', '创新挑战赛', '技术需求对接', '成果转化', '推广体系', '农民培训', '创业指导', '产学研合作', '科普宣传', '公众参与', '信息平台'] }
  }

  function randomDate(daysAgo) {
    const d = new Date()
    d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
    d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0)
    return d
  }

  for (const [slug, template] of Object.entries(newsTemplates)) {
    // 获取该栏目下的子栏目列表
    const subs = await prisma.subCategory.findMany({ where: { menuSlug: slug }, orderBy: { sortOrder: 'asc' } })
    for (let i = 0; i < 20; i++) {
      const prefix = template.prefixes[i]
      const title = `${prefix}——${template.title}系列报道（${i + 1}）`
      // 轮询分配子栏目
      const subIdx = i % (subs.length || 1)
      const subCategoryId = subs.length ? subs[subIdx].id : null
      await prisma.newsArticle.create({
        data: {
          title,
          summary: `${prefix}相关内容摘要：本文围绕${template.title}主题，介绍最新进展与成果。`,
          content: `<h2>${prefix}</h2><p>本文为${template.title}领域系列报道第${i + 1}篇。重点介绍${template.title}方面的最新政策动态、技术进展与实践经验，为推动热带农业绿色低碳转型提供参考。</p><p>中国热带农业科学院在${template.title}领域持续开展研究和示范推广工作，取得了阶段性成果。</p>`,
          publishTime: randomDate(30),
          categorySlug: slug,
          subCategoryId: subCategoryId
        }
      })
    }
  }

    console.log('Seed completed!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
