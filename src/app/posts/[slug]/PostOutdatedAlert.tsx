import React from 'react'
import useTranslation from '@/hooks/useTranslation'
import { Warning } from '@/components/icons'

export interface PostOutdatedAlertProps {
  days: number
}

// 居中的灰色提示：警告图标 + 说明文字，温和不刺眼
const PostOutdatedAlert: React.FC<PostOutdatedAlertProps> = ({ days }) => {
  const { t } = useTranslation()

  return (
    <div className="mt-12 flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500">
      <Warning className="w-4 h-4 shrink-0" aria-hidden />
      <p className="text-sm leading-relaxed">{t('post-page.outdated-notice', { days })}</p>
    </div>
  )
}

export default PostOutdatedAlert
