interface PostFrontmatter {
  title: string // 标题
  date: string // 创建日期
  updatedOn?: string // 最后更新日期，git commit 之前会自动更新此字段
  tags?: string[] // 标签
  toc?: boolean // 侧边导航是否可见，默认为 true
  image?: string // 顶部图片地址
  draft?: boolean // 为 true 则不会展示该文章，默认为 false
  summary?: string // AI 生成的摘要，构建时由 scripts/summarize-posts.js 自动补齐
  skipSummary?: boolean // 为 true 时跳过 AI 摘要（不生成且不展示）
  [key: string]: any
}

interface PostReadingTime {
  minutes: number
  text: string
  time: number
  words: number
}

declare namespace Intl {
  function getCanonicalLocales(locales: string | string[]): string[]
}
