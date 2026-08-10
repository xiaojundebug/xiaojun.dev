const fs = require('fs').promises
const path = require('path')
const glob = require('fast-glob')
const { updateFrontmatter } = require('./update-frontmatter-with-hash')
const { summarizeAllPosts } = require('./summarize-posts')

const processAllMdxFiles = async () => {
  console.log('Processing all MDX files before build...')

  const postsDir = path.join(__dirname, '../posts')
  const mdxFiles = await glob('**/*.{md,mdx}', { cwd: postsDir, absolute: true })

  console.log(`Found ${mdxFiles.length} MDX files to process`)

  let updatedCount = 0

  for (const filePath of mdxFiles) {
    try {
      const updated = await updateFrontmatter(filePath)
      if (updated) {
        updatedCount++
        console.log(`Updated: ${path.relative(process.cwd(), filePath)}`)
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error)
    }
  }

  console.log(`\nSummary: ${updatedCount} file(s) updated out of ${mdxFiles.length}`)

  // 为没有 summary 的文章生成 AI 摘要（未配置 OPENAI 环境变量时自动跳过）
  await summarizeAllPosts()
}

processAllMdxFiles().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})
