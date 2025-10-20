[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxiaojundebug%2Fxiaojun.dev)

# xiaojun.dev

[English](./README.md) • [中文](./README.zh-CN.md)

我的个人博客，由 Next.js、TypeScript、MDX 和 TailwindCSS 构建。

👀 [在线预览](https://xiaojun.dev/)

## 特色

- 🎨 简洁、丝滑、快速
- ✨ 支持黑暗模式、响应式设计、主题色配置
- 🧩 内置一些 Markdown 扩展语法，得益于 MDX，还支持在文章中嵌入 JSX 组件
- 🎮 内置 CodePlayground，可以直接在文章中运行代码块（beta）
- 🔫 充满趣味的点赞按钮、访问量计数器、音效反馈

## 开始使用

1. fork 该仓库
2. 进行本地开发，执行 `npm i` 安装依赖
3. 通过 `site.config.js` 自定义配置
4. 为了能使用点赞功能以及访问量统计功能，需注册申请 [Upstash Redis](https://console.upstash.com/redis) 服务（可以白嫖），根目录下创建 `.env` 文件并填入以下信息

   ```env
   UPSTASH_REDIS_REST_URL = 填入自己的信息
   UPSTASH_REDIS_REST_TOKEN = 填入自己的信息
   ```

5. 使用 `npm run new:post filename title [tag1] [tag2] ...` 命令在 `posts` 中创建一篇文章，更多语法可参考[示例文章](https://www.xiaojun.dev/posts/2023-04-27-mdx-syntax-guide)
6. 执行 `npm run dev` 预览效果
7. 将它部署在 [Vercel](https://vercel.com)，具体很简单，可以跟着官方教程一步步来
8. 如果你喜欢的话，麻烦给这个项目一个 start ✨，这对我是很大鼓励 🙏

## 感谢

### 站点音效

https://zapsplat.com

### 参考网站

该项目参考但不限于以下网站

- https://www.joshwcomeau.com
- https://cali.so
- https://leerob.io
- https://vuepress.vuejs.org
- https://vitepress.dev
- https://docusaurus.io
- https://github.com/iissnan/hexo-theme-next
- https://github.com/nanxiaobei/hugo-paper
