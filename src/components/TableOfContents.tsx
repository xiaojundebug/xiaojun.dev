'use client'

import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { animationFrameScheduler, fromEvent, startWith, throttleTime } from 'rxjs'
import { animated, useSpring } from '@react-spring/web'
import useBoolean from '@/hooks/useBoolean'
import { windowScroll$ } from '@/common/observables'

function findFocusedHeadingElement(list: HTMLHeadingElement[]) {
  let start = 0
  let end = list.length - 1
  let result = 0

  while (start <= end) {
    let mid = Math.floor((start + end) / 2)
    if (list[mid].getBoundingClientRect().top <= 50) {
      result = mid
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return list[result]
}

function useScrollSpy(ids: string[]) {
  const [focusedId, setFocusedId] = useState<string>()

  useEffect(() => {
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean)
    const sub = windowScroll$.pipe(startWith(null)).subscribe(evt => {
      const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 10
      const el = isAtBottom
        ? elements[elements.length - 1]
        : findFocusedHeadingElement(elements as HTMLHeadingElement[])
      setFocusedId(el?.id)
    })
    return () => sub.unsubscribe()
  }, [ids])

  return focusedId
}

export type Heading = { id: string; text: string; level: number }
export interface TableOfContentsProps {
  headings: Heading[]
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const focusedItemRef = useRef<HTMLLIElement>(null)
  const focusedId = useScrollSpy(headings.map(({ id }) => id))
  const [isOverflowing, { set: setIsOverflowing }] = useBoolean(false)
  const [isScrolledTop, { set: setIsScrolledTop }] = useBoolean(true)
  const [isScrolledBottom, { set: setIsScrolledBottom }] = useBoolean(true)

  const [{ scrollTop }, scrollApi] = useSpring(() => ({
    scrollTop: 0,

    config: { tension: 260, friction: 30 },
  }))

  useEffect(() => {
    const scroller = scrollerRef.current
    const list = listRef.current

    if (!scroller || !list) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // intersectionRatio 不为 1 代表可以滚动
        setIsOverflowing(entry.intersectionRatio !== 1)
      },
      {
        root: scroller,
      },
    )

    observer.observe(list)

    const scrollSub = fromEvent(scroller, 'scroll')
      .pipe(throttleTime(0, animationFrameScheduler, { leading: true, trailing: true }))
      .subscribe(() => {
        setIsScrolledTop(scroller.scrollTop === 0)
        setIsScrolledBottom(scroller.scrollTop + scroller.offsetHeight === list.offsetHeight)
      })

    return () => {
      observer.disconnect()
      scrollSub.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const anchor = focusedItemRef.current
    if (!scrollerRef.current || !focusedId || !anchor) return
    const listRect = scrollerRef.current.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()

    scrollApi.start({
      scrollTop: anchor.offsetTop - (listRect.height - anchorRect.height) / 2,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId])

  function shouldActive(heading: Heading) {
    if (heading.id === focusedId) return true

    let idx = headings.findIndex(h => h.id === focusedId)
    const currentHeading = headings[idx]

    if (!currentHeading || currentHeading.level === 1) return false

    while (--idx >= 0) {
      const h = headings[idx]

      if (h.level > headings[idx + 1].level) return false
      if (h.level < headings[idx + 1].level && h.id === heading.id) return true
    }

    return false
  }

  return (
    <div className="group/toc relative">
      {/* Top Shadow */}
      <div
        className={clsx(
          'absolute inset-x-0 top-0 z-10 h-7 pointer-events-none',
          'bg-gradient-to-b from-white dark:from-zinc-950 to-transparent',
          `opacity-${isOverflowing && !isScrolledTop ? 100 : 0}`,
        )}
      ></div>
      {/* Bottom Shadow */}
      <div
        className={clsx(
          'absolute inset-x-0 bottom-0 z-10 h-7 pointer-events-none',
          'bg-gradient-to-t from-white dark:from-zinc-950 to-transparent',
          `opacity-${isOverflowing && !isScrolledBottom ? 100 : 0}`,
        )}
      ></div>

      <animated.div
        ref={scrollerRef}
        className="relative max-h-[308px] overflow-y-scroll no-scrollbar"
        scrollTop={scrollTop}
      >
        <ul ref={listRef} className="list-none overflow-y-hidden">
          {headings.map(heading => {
            const active = shouldActive(heading)

            return (
              <li key={heading.id} ref={focusedId === heading.id ? focusedItemRef : null}>
                <a
                  href={`#${heading.id}`}
                  className={clsx(
                    'group relative flex items-center gap-2 max-w-full h-7 text-[13px] font-medium truncate hover:text-zinc-800 dark:hover:text-zinc-50',
                    {
                      'text-zinc-400 dark:text-zinc-500': !active,
                      'text-zinc-800 dark:text-zinc-50 font-medium': active,
                    },
                  )}
                >
                  <div className="w-[20px]">
                    <div
                      className={clsx(
                        'h-0.5 rounded-full group-hover:bg-black/50 dark:group-hover:bg-white/50',
                        {
                          'bg-zinc-400/20': !active,
                          'bg-zinc-400': active,
                        },
                      )}
                      style={{
                        width: heading.level === 2 ? 18 : heading.level === 3 ? 10 : 4,
                      }}
                    ></div>
                  </div>
                  <span
                    className={clsx(
                      'truncate transition-opacity duration-200',
                      {
                        'opacity-100': active,
                        'opacity-0 group-hover/toc:opacity-100': !active,
                      },
                    )}
                  >
                    {heading.text}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </animated.div>
    </div>
  )
}

export default TableOfContents
