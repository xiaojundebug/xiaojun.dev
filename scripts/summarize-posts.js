require('dotenv').config({ quiet: true })
const fs = require('fs').promises
const path = require('path')
const glob = require('fast-glob')
const matter = require('gray-matter')

const POSTS_DIR = path.join(__dirname, '../posts')
const CONCURRENCY = 3

const summarizePost = async (filePath, { force = false } = {}) => {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(fileContent)

  if (frontmatter.skipSummary) {
    console.log(`Skip (skipSummary): ${path.relative(process.cwd(), filePath)}`)
    return 'skipped'
  }

  if (frontmatter.draft) {
    console.log(`Skip (draft): ${path.relative(process.cwd(), filePath)}`)
    return 'skipped'
  }

  if (frontmatter.summary && !force) {
    console.log(`Skip (already has summary): ${path.relative(process.cwd(), filePath)}`)
    return 'skipped'
  }

  if (!content.trim()) {
    console.log(`Skip (empty content): ${path.relative(process.cwd(), filePath)}`)
    return 'skipped'
  }

  try {
    console.log(`Generating: ${frontmatter.title}`)
    const summary = await callOpenAI(frontmatter.title, content)

    const newFrontmatter = { ...frontmatter, summary }
    await fs.writeFile(filePath, matter.stringify(content, newFrontmatter))
    return 'updated'
  } catch (error) {
    // 带上文件名再抛出，方便定位哪篇文章失败了
    throw new Error(`${path.relative(process.cwd(), filePath)}: ${error.message}`)
  }
}

const callOpenAI = async (title, content) => {
  const {
    OPENAI_BASE_URL = 'https://api.openai.com/v1',
    OPENAI_API_KEY,
    OPENAI_MODEL = 'gpt-4o-mini',
  } = process.env

  const response = await fetch(`${OPENAI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    // 60s 超时，防止网关挂起导致脚本卡死
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `你是一个文章摘要助手。请用简体中文输出纯文本摘要，不加“摘要：”等前缀，不使用列表或 Markdown。

要求：
1. 概括文章的核心内容和主要观点，确保准确、完整、客观。
2. 摘要控制在 180～220 字，绝对不要超过 220 字。
3. 输出 3～5 句话，语言简洁、自然、连贯，避免冗余和重复。
4. 遵循中西文混排规范，中文与英文字母、数字之间适当留空格。
5. 仅基于文章正文进行概括，不检索或参考正文中导入的文件、组件及外部链接内容。`,
        },
        {
          role: 'user',
          content: `请为以下文章《${title}》生成摘要。

文章内容：
${content}`,
        },
      ],
      temperature: 0.3,
      thinking: { type: 'disabled' },
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`)
  }

  const data = await response.json()
  const choice = data.choices?.[0]
  const summary = choice?.message?.content?.trim()

  // 摘要非空但被 token 上限截断时提示（说明摘要不完整）
  if (summary && choice?.finish_reason === 'length') {
    console.log(
      `  Warning: response truncated (title: ${title}, usage: ${JSON.stringify(data.usage)})`,
    )
  }

  if (!summary) {
    // 失败时打印完整原始响应，方便排查
    throw new Error(`OpenAI API returned empty summary. Raw response: ${JSON.stringify(data)}`)
  }
  return summary
}

// 小并发池，避免瞬间请求过多被限流
const runWithConcurrency = async (tasks, limit) => {
  const results = new Array(tasks.length)
  let index = 0

  const worker = async () => {
    while (index < tasks.length) {
      const i = index++
      try {
        results[i] = await tasks[i]()
      } catch (error) {
        // 单篇失败不中断整体，记录后继续处理下一篇
        console.error(`Failed: ${error.message}`)
        results[i] = 'failed'
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
  return results
}

const summarizeAllPosts = async () => {
  const { OPENAI_API_KEY } = process.env
  // --force / -f 强制重新生成已有 summary 的文章（仍跳过草稿和 skipSummary）
  const force = process.argv.includes('--force') || process.argv.includes('-f')

  if (!OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY 未配置，跳过 AI 摘要生成（详见 README 的环境变量说明）')
    return 0
  }

  console.log(
    force
      ? 'Generating AI summaries (force mode, existing summaries will be refreshed)...'
      : 'Generating AI summaries for posts without summary...',
  )

  const mdxFiles = await glob('**/*.{md,mdx}', { cwd: POSTS_DIR, absolute: true })
  const results = await runWithConcurrency(
    mdxFiles.map(file => () => summarizePost(file, { force })),
    CONCURRENCY,
  )

  const updated = results.filter(r => r === 'updated').length
  const skipped = results.filter(r => r === 'skipped').length
  const failed = results.filter(r => r === 'failed').length
  console.log(
    `\nSummary: ${updated} generated, ${skipped} skipped, ${failed} failed (${mdxFiles.length} total)`,
  )
  return { updated, skipped, failed }
}

// 直接运行脚本时（node scripts/summarize-posts.js）自执行，被 pre-build 引入时仅导出
if (require.main === module) {
  summarizeAllPosts()
    .then(({ failed }) => process.exit(failed > 0 ? 1 : 0))
    .catch(error => {
      console.error('Error:', error)
      process.exit(1)
    })
}

module.exports = { summarizeAllPosts }
