'use client'

import React from 'react'
import Link from 'next/link'

// 终端风格的"回到文章列表"按钮：从文章（文件）cd .. 回到 posts 目录
const GoBack: React.FC = () => {
  return (
    <div className="mt-14 flex justify-center">
      <Link
        href="/posts"
        className="group font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="text-zinc-500 dark:text-zinc-600 transition-colors duration-200 group-hover:text-zinc-400 dark:group-hover:text-zinc-500">
          $&nbsp;
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 transition-colors duration-200 group-hover:text-primary">
          cd ..
        </span>
      </Link>
    </div>
  )
}

export default GoBack
