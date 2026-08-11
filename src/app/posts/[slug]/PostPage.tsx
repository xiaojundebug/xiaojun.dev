import React, { useMemo } from 'react'
import { getMDXExport } from 'mdx-bundler/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import config from 'config'
import useTranslation from '@/hooks/useTranslation'
import HorizontalRule from '@/components/HorizontalRule'
import DesktopOnly from '@/components/DesktopOnly'
import { ArrowLeft, ArrowRight, Calender, Click, Clock } from '@/components/icons'
import BleedThroughImage, { BleedThroughImageProps } from '@/components/BleedThroughImage'
import { PostHitCounter, PostViews, PostViewsProvider } from './PostViews'
import PostContent from './PostContent'
import PostRightAside from './PostRightAside'
import PostOutdatedAlert from './PostOutdatedAlert'
import AISummary from '@/components/AISummary'
import GoBack from '@/components/GoBack'
import { Heading } from '@/components/TableOfContents'

export interface PostPageProps {
  slug: string
  code: string
  frontmatter: PostFrontmatter
  headings?: Heading[]
  prevPost?: { link: string; title: string; date?: string }
  nextPost?: { link: string; title: string; date?: string }
  heroImageInfo?: BleedThroughImageProps
}

const PostPage: React.FC<PostPageProps> = props => {
  const { t } = useTranslation()
  const {
    slug,
    code,
    frontmatter: { title, date, updatedOn, tags, image, summary, skipSummary },
    headings,
    prevPost,
    nextPost,
    heroImageInfo,
  } = props
  const { readingTime } = useMemo(
    () => getMDXExport(code) as { readingTime: PostReadingTime },
    [code],
  )
  const diffDays = useMemo(() => dayjs().diff(updatedOn || date, 'day'), [updatedOn, date])

  return (
    <>
      <PostViewsProvider slug={slug}>
        <div className="prose-container relative flex mt-4 sm:mt-28">
          <main className="flex-1 w-0">
            {/* Hero Image */}
            {image && heroImageInfo && (
              <div className="sm:-mx-8 mb-14">
                <BleedThroughImage {...heroImageInfo} />
              </div>
            )}

            <h1 className="mt-6 text-3xl sm:text-5xl text-black dark:text-white tracking-tight !leading-snug font-medium">
              {title}
            </h1>

            <div className="mt-4 text-zinc-400 dark:text-zinc-500">
              <div className="flex items-center text-sm">
                <span className="flex items-center">
                  {/* Create time */}
                  <>
                    <Calender className="mr-1 text-base" aria-hidden />
                    {dayjs(date).format('MMM D, YYYY')}
                  </>
                  <span className="mx-2">•</span>
                  {/* Reading time */}
                  <>
                    <Clock className="mr-1 text-base" aria-hidden />
                    {readingTime.text}
                  </>
                  {/* Views */}
                  <span className="mx-2">•</span>
                  <>
                    <Click className="mr-1 text-base" />
                    <PostViews />
                  </>
                </span>
              </div>
            </div>

            {/* 标签 */}
            {tags && tags.length > 0 && (
              <div className="flex items-center flex-wrap m-auto mt-6 text-sm gap-2 sm:gap-3">
                {tags.map((tag: string) => (
                  <Link
                    key={tag}
                    className="bg-primary/[0.12] text-primary px-2.5 py-0.5 rounded-full font-medium"
                    href={`/tags/${tag}`}
                    prefetch={false}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 旧文章提醒 */}
            {diffDays >= config.outdatedPostThresholdDays && <PostOutdatedAlert days={diffDays} />}

            {/* AI 摘要 */}
            {summary && !skipSummary && <AISummary summary={summary} />}

            {/* Markdown 内容 */}
            <article className="markdown w-full mt-10">
              <PostContent code={code} />
            </article>

            {/* 阅读计数器 & 最后修改时间 */}
            <div className="mt-24 flex items-end justify-between">
              <div className="flex flex-col items-start gap-1">
                <h3 className="text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                  {t('post-page.hits')}
                </h3>
                <PostHitCounter />
              </div>
              <div className="text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                {t('post-page.last-updated')} {dayjs(updatedOn || date).format('YYYY-MM-DD')}
              </div>
            </div>

            <HorizontalRule />

            {config.adjacentPosts && (prevPost || nextPost) && (
              <section className="mt-20">
                {/* 继续阅读 */}
                <p className="mb-8 text-center font-mono text-[13px] text-zinc-400 dark:text-zinc-500">
                  {t('post-page.continue-reading')}
                </p>

                {prevPost && (
                  <Link href={prevPost.link} className="block -mx-3 sm:-mx-4 group" prefetch={false}>
                    <article className="relative p-3 sm:p-4 rounded-xl">
                      <span className="mb-1.5 flex items-center gap-1 font-mono text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                        <ArrowLeft
                          className="w-3.5 h-3.5 transition-transform duration-300 ease-out-back group-hover:-translate-x-1"
                          aria-hidden
                        />
                        {t('post-page.prev')}
                      </span>
                      <h3 className="mb-1.5 text-lg font-medium group-hover:text-primary transition-colors">
                        {prevPost.title}
                      </h3>
                      <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                        {dayjs(prevPost.date).format('MMM D, YYYY')}
                      </span>
                    </article>
                  </Link>
                )}

                {nextPost && (
                  <Link href={nextPost.link} className="block -mx-3 sm:-mx-4 group" prefetch={false}>
                    <article className="relative p-3 sm:p-4 rounded-xl">
                      <span className="mb-1.5 flex items-center gap-1 font-mono text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                        {t('post-page.next')}
                        <ArrowRight
                          className="w-3.5 h-3.5 transition-transform duration-300 ease-out-back group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                      <h3 className="mb-1.5 text-lg font-medium group-hover:text-primary transition-colors">
                        {nextPost.title}
                      </h3>
                      <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                        {dayjs(nextPost.date).format('MMM D, YYYY')}
                      </span>
                    </article>
                  </Link>
                )}
              </section>
            )}

            {/* 返回上一页 */}
            <GoBack />
          </main>

          <DesktopOnly>
            <PostRightAside slug={slug} headings={headings} />
          </DesktopOnly>
        </div>
      </PostViewsProvider>
    </>
  )
}

export default PostPage
