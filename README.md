[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxiaojundebug%2Fxiaojun.dev)

# xiaojun.dev

[English](./README.md) • [中文](./README.zh-CN.md)

My personal blog, built with Next.js, TypeScript, MDX, and TailwindCSS.

👀 [Live Demo](https://xiaojun.dev/)

## Features

- 🎨 Simple, smooth, and fast
- ✨ Supports dark mode, responsive design, and theme color customization
- 🧩 Built-in Markdown extensions, powered by MDX, with support for embedding JSX components in posts
- 🎮 Built-in CodePlayground (beta) for running code blocks directly in posts
- 🔫 Fun like button, hit counter, and sound feedback

## Getting Started

1. Fork this repository
2. Run `npm i` to install dependencies
3. Customize the configuration in `site.config.js`
4. To use the like button and hit counter, register for the [Upstash Redis](https://console.upstash.com/redis) service, create a `.env` file in the root directory, and fill in the following information:

   ```env
   UPSTASH_REDIS_REST_URL = xxx
   UPSTASH_REDIS_REST_TOKEN = xxx
   ```

5. (Optional) AI summary at the top of post pages: configure an OpenAI-compatible API in `.env`. During `npm run build`, Chinese summaries are generated automatically for posts without a `summary` frontmatter field and written into the frontmatter (posts that already have one are skipped; if the API is not configured, generation is skipped without affecting the build):

   ```env
   OPENAI_BASE_URL = your OpenAI-compatible endpoint (e.g. https://api.openai.com/v1)
   OPENAI_API_KEY = your API key
   OPENAI_MODEL = model name, defaults to gpt-4o-mini
   ```

   You can also run `npm run summarize` at any time to backfill summaries manually, or `npm run summarize:force` to regenerate all summaries (posts marked as draft or `skipSummary: true` are still skipped). To exclude a post from AI summaries, set `skipSummary: true` in its frontmatter (both generation and rendering are skipped).

6. Run `npm run new:post filename title [tag1] [tag2] ...` to create a post in the `posts` folder; see the [example posts](https://www.xiaojun.dev/posts/2023-04-27-mdx-syntax-guide) for more syntax
7. Run `npm run dev` to preview
8. Deploy it on [Vercel](https://vercel.com)
9. If you like it, please give this project a star ✨ — it’s a great encouragement to me 🙏

## Thanks

### Sound Effects

https://zapsplat.com

### Reference Sites

- https://www.joshwcomeau.com
- https://cali.so
- https://leerob.io
- https://vuepress.vuejs.org
- https://vitepress.dev
- https://docusaurus.io
- https://github.com/iissnan/hexo-theme-next
- https://github.com/nanxiaobei/hugo-paper
