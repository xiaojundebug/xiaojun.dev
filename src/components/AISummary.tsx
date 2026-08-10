import React from 'react'
import useTranslation from '@/hooks/useTranslation'
import { Sparkles } from '@/components/icons'

export interface AISummaryProps {
  summary: string
}

const AISummary: React.FC<AISummaryProps> = ({ summary }) => {
  const { t } = useTranslation()

  return (
    <aside className="mt-10 rounded-xl border border-primary/25 bg-primary/[0.05] px-5 py-4">
      <h2 className="flex items-center gap-1.5 text-sm font-bold text-primary">
        <Sparkles className="w-4 h-4" />
        {t('post-page.ai-summary')}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">{summary}</p>
    </aside>
  )
}

export default AISummary
