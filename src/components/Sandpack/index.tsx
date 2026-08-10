import React, { isValidElement, PropsWithChildren, useMemo, useRef, useState } from 'react'
import styles from './styles.module.scss'
import ResetButton from '@/components/CodeBlock/ResetButton'
import RefreshButton from '@/components/CodeBlock/RefreshButton'
import ClearButton from '@/components/CodeBlock/ClearButton'
import clsx from 'clsx'
import { SandpackPredefinedTemplate, useSandpack } from '@codesandbox/sandpack-react'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  FileTabs,
  useSandpackNavigation,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react'
import { ExternalLink } from '../icons'

type TabType = 1 | 2

const tabs: { label: string; type: TabType }[] = [
  { label: 'Result', type: 1 },
  { label: 'Console', type: 2 },
]

const ResetIcon = () => {
  const {
    sandpack: { resetAllFiles },
  } = useSandpack()
  return <ResetButton onClick={resetAllFiles} />
}

const RefreshIcon = () => {
  const { refresh } = useSandpackNavigation()
  return <RefreshButton onClick={refresh} />
}

export interface SandpackProps {
  template: SandpackPredefinedTemplate
  dependencies?: Record<string, string>
  externalResources?: string[]
}

const Sandpack: React.FC<PropsWithChildren<SandpackProps>> = props => {
  const { children, template, dependencies, externalResources } = props
  const [tabType, setTabType] = useState<TabType>(1)
  const consoleRef = useRef<{ reset: () => void }>(null)
  const files = useMemo(() => {
    const codeSnippets = React.Children.toArray(children)
    return codeSnippets.reduce((result, snippet) => {
      if (isValidElement(snippet)) {
        const filename = snippet.props.filename
        const code = snippet.props.children
        const active = !!snippet.props.active

        if (filename) {
          return {
            ...result,
            [filename]: { code, active },
          }
        }
      }

      return result
    }, {})
  }, [children])
  const customSetup = useMemo(() => ({ dependencies: dependencies || {} }), [dependencies])
  const options = useMemo(
    () => ({ externalResources: externalResources || [] }),
    [externalResources],
  )

  return (
    <SandpackProvider
      template={template}
      theme="dark"
      files={files}
      customSetup={customSetup}
      options={options}
    >
      <div
        className={clsx(
          'relative prose-bleed my-8 border-2 border-zinc-600/50 bg-zinc-900 rounded-xl overflow-hidden',
          styles.codePlayground,
        )}
      >
        <div className="flex items-center justify-between h-8 px-4 bg-zinc-600/50">
          <span className="text-sm text-white font-medium">{'Code Playground'}</span>
          <div className="flex items-center gap-4">
            <ResetIcon />
            <UnstyledOpenInCodeSandboxButton>
              <ExternalLink className="cursor-pointer text-zinc-400 text-lg hover:text-zinc-300 transition-colors" />
            </UnstyledOpenInCodeSandboxButton>
          </div>
        </div>
        {/* Editor */}
        <div>
          <FileTabs />
          <div className="min-h-[200px] max-h-[400px] sm:max-h-[500px] overflow-auto better-scrollbar">
            <SandpackCodeEditor showLineNumbers showRunButton={false} showTabs={false} />
          </div>
        </div>
        <div className="flex justify-between h-10 px-3 border-t border-b border-zinc-600/50 text-sm text-white">
          <div className="flex items-stretch h-full">
            {tabs.map(tab => (
              <button
                key={tab.type}
                className={clsx('inline-flex items-center px-2 border-b cursor-pointer', {
                  'border-yellow-400 text-white': tabType === tab.type,
                  'border-transparent text-white/50': tabType !== tab.type,
                })}
                onClick={() => setTabType(tab.type)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            {{
              1: () => <RefreshIcon />,
              2: () => <ClearButton onClick={() => consoleRef.current?.reset()} />,
            }[tabType]()}
          </div>
        </div>
        <div className="p-3" hidden={tabType !== 1}>
          <SandpackPreview
            className="h-[360px] rounded bg-white overflow-hidden"
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            showRestartButton={false}
            showOpenNewtab={false}
          />
        </div>
        {/* Console */}
        <div className="h-[360px]" hidden={tabType !== 2}>
          <SandpackConsole
            ref={consoleRef}
            showRestartButton={false}
            showResetConsoleButton={false}
          />
        </div>
      </div>
    </SandpackProvider>
  )
}

export default Sandpack
