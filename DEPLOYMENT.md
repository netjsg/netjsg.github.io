# 部署指南

这个博客项目支持多种部署方式。本文档介绍了如何将博客部署到 GitHub Pages 和云服务器。

## 前置准备

1. 确保已安装 Node.js 和 pnpm
2. 克隆或下载项目到本地
3. 运行 `pnpm install` 安装依赖

## 构建项目

在部署之前，需要先构建项目：

```bash
pnpm build
```

构建完成后，静态文件将生成在 `dist` 目录中。

## 部署到 GitHub Pages

### 方法 1：使用 GitHub Actions（推荐）

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建一个新仓库
   - 如果要使用 `username.github.io` 域名，仓库名必须为 `username.github.io`
   - 否则可以使用任意仓库名，GitHub Pages 会在 `username.github.io/repo-name` 下部署

2. **配置 GitHub Actions**
   - 在项目根目录创建 `.github/workflows/deploy.yml` 文件
   - 添加以下内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **配置仓库设置**
   - 进入仓库的 Settings → Pages
   - 选择 "Deploy from a branch"
   - 选择 `gh-pages` 分支作为源
   - 保存设置

4. **推送代码**
   - 将代码推送到 main 分支
   - GitHub Actions 会自动构建并部署

### 方法 2：手动部署

1. **构建项目**
   ```bash
   pnpm build
   ```

2. **创建 gh-pages 分支**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   ```

3. **复制构建文件**
   ```bash
   cp -r dist/* .
   ```

4. **提交并推送**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## 部署到云服务器

### 使用 Nginx

1. **连接到服务器**
   ```bash
   ssh user@your-server-ip
   ```

2. **安装 Nginx**
   ```bash
   sudo apt-get update
   sudo apt-get install nginx
   ```

3. **构建项目**
   ```bash
   pnpm build
   ```

4. **上传构建文件**
   ```bash
   scp -r dist/* user@your-server-ip:/var/www/html/
   ```

5. **配置 Nginx**
   编辑 `/etc/nginx/sites-available/default`：

   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       
       server_name _;
       
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 缓存静态资源
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **重启 Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### 使用 Docker

1. **创建 Dockerfile**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install
   COPY . .
   RUN pnpm build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **创建 nginx.conf**
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **构建和运行**
   ```bash
   docker build -t simple-blog .
   docker run -p 80:80 simple-blog
   ```

## 自定义域名

### GitHub Pages

1. 在项目根目录创建 `CNAME` 文件
2. 添加你的域名（例如 `blog.example.com`）
3. 在域名提供商的 DNS 设置中添加 CNAME 记录指向 `username.github.io`

### 云服务器

1. 在域名提供商的 DNS 设置中添加 A 记录指向你的服务器 IP
2. 配置 SSL 证书（使用 Let's Encrypt）：
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 常见问题

### 部署到 GitHub Pages 后页面显示 404

确保在 `vite.config.ts` 中配置了正确的 base 路径。如果使用子路径部署，需要设置：

```typescript
export default defineConfig({
  base: '/repo-name/',
  // ...
})
```

### 刷新页面后显示 404

这是因为服务器没有正确配置。确保在 Nginx 配置中添加了 `try_files $uri $uri/ /index.html;`。

### 静态资源加载失败

检查资源的相对路径。如果使用 CDN URL，确保在代码中正确引用。

## 监控和维护

- 定期检查服务器日志
- 监控网站性能和可用性
- 定期备份内容和配置
- 及时更新依赖和安全补丁
