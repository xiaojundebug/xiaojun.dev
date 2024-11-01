import React, { useEffect, useMemo } from 'react'
import Provider, { ProviderProps } from '@/components/CodeBlock/playground/Provider'
import Editor from './Editor'
import clsx from 'clsx'
import useBoolean from '@/hooks/useBoolean'
import { copyToClipboard } from '@/common/clipboard'
import CopyButton from './CopyButton'

const enum CodeLineMarks {
  ADDED = '++',
  REMOVED = '--',
  HIGHLIGHT = 'highlight',
  WARNING = 'warning',
  ERROR = 'error',
  FOCUS = 'focus',
}

export interface FencedCodeBlockProps {
  language: ProviderProps['language']
  code: string
  highlights?: string
  raw?: boolean
  lineNumbers?: boolean
  title?: string
}

// 静态围栏代码块高亮
const FencedCodeBlock: React.FC<FencedCodeBlockProps> = props => {
  const { language, code, highlights = '', raw, lineNumbers, title } = props
  const [copied, { set: setCopied }] = useBoolean(false)

  const {
    parsedCode,
    addedLines,
    removedLines,
    highlightedLines,
    warningLines,
    errorLines,
    focusedLines,
  } = useMemo(() => {
    const lines = code.split('\n')
    let parsedCode = ''
    const addedLines: number[] = []
    const removedLines: number[] = []
    const highlightedLines = new Set<number>()
    const warningLines: number[] = []
    const errorLines: number[] = []
    const focusedLines: number[] = []

    if (highlights) {
      for (const segment of highlights.split(',')) {
        const limits = segment.split('-')
        if (limits.length === 1) {
          highlightedLines.add(parseInt(limits[0]))
        } else if (limits.length === 2) {
          let [start, end] = [parseInt(limits[0]), parseInt(limits[1])].sort((a, b) => a - b)

          while (start <= end) {
            highlightedLines.add(start)
            start++
          }
        }
      }
    }

    if (!raw) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const match = line.match(/^([\s\S]*?)\/\/ \[!code (.*?)]/)

        if (match) {
          const codeLine = match[1]
          const mark = match[2]

          const fn = {
            [CodeLineMarks.ADDED]: () => addedLines.push(i + 1),
            [CodeLineMarks.REMOVED]: () => removedLines.push(i + 1),
            [CodeLineMarks.HIGHLIGHT]: () => highlightedLines.add(i + 1),
            [CodeLineMarks.WARNING]: () => warningLines.push(i + 1),
            [CodeLineMarks.ERROR]: () => errorLines.push(i + 1),
            [CodeLineMarks.FOCUS]: () => focusedLines.push(i + 1),
          }[mark]

          if (fn) {
            fn()
          }

          parsedCode += codeLine + '\n'
        } else {
          parsedCode += line + '\n'
        }
      }
    }

    return {
      parsedCode: raw ? code : parsedCode.trim(),
      addedLines,
      removedLines,
      highlightedLines: Array.from(highlightedLines),
      warningLines,
      errorLines,
      focusedLines,
    }
  }, [code, highlights, raw])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied])

  async function onCopy() {
    await copyToClipboard(parsedCode)
    setCopied(true)
  }

  return (
    <Provider language={language} defaultCode={parsedCode}>
      <div className="fenced-code-block relative mt-12 mb-8 prose-bleed">
        {/* language */}
        {!title && (
          <div className="absolute right-8 px-3 pt-0.5 -translate-y-full rounded-t-md bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono font-medium">
            {language.toUpperCase()}
          </div>
        )}
        {/* title */}
        {title && (
          <div className="px-4 py-1.5 border-b border-slate-400/10 rounded-t-xl bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-mono font-medium">
            {title}
          </div>
        )}
        <div className="group/editor relative">
          {/* copy to clipboard */}
          <div className="absolute right-3 top-3 z-10 flex opacity-0 group-hover/editor:opacity-100 transition-opacity">
            <CopyButton copied={copied} onCopy={onCopy} />
          </div>
          <div
            className={clsx(
              'max-h-[500px] sm:max-h-[700px] rounded-b-xl bg-slate-100 dark:bg-zinc-900 overflow-auto better-scrollbar',
              {
                'rounded-t-xl': !title,
              },
            )}
          >
            <Editor
              className="playground-editor"
              disabled
              lineNumbers={lineNumbers}
              highlightedLines={highlightedLines}
              addedLines={addedLines}
              removedLines={removedLines}
              warningLines={warningLines}
              errorLines={errorLines}
              focusedLines={focusedLines}
            />
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default FencedCodeBlock
