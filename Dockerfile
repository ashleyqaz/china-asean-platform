# ============================================
# 中国—东盟气候智慧型热带农业协同平台
# 混合模式部署：预渲染页面静态生成 + API 动态运行
# ============================================

# --- 构建阶段 ---
FROM node:22-alpine AS build
WORKDIR /app

# 安装依赖
COPY package.json package-lock.json* ./
RUN npm ci

# 复制源码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# Nuxt 构建（预渲染 + 打包 server）
RUN npm run build

# --- 生产阶段 ---
FROM node:22-alpine AS production
WORKDIR /app

# 只复制运行时需要的文件
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# 确保数据库目录存在
RUN mkdir -p /app/db

# 暴露端口（Nitro 默认 3000）
EXPOSE 3000

# 运行前自动同步数据库结构
CMD ["sh", "-c", "npx prisma db push --skip-generate 2>/dev/null; node .output/server/index.mjs"]
