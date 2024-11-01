import React from 'react'
import styles from './Editor.module.scss'
import Highlight, { defaultProps, PrismTheme } from 'prism-react-renderer'
import CodeEditor from 'react-simple-code-editor'
import clsx from 'clsx'
import usePlaygroundContext from './usePlaygroundContext'

export interface EditorProps {
  className?: string
  fontSize?: number
  disabled?: boolean
  theme?: PrismTheme
  highlightedLines?: number[]
  addedLines?: number[]
  removedLines?: number[]
  focusedLines?: number[]
  errorLines?: number[]
  warningLines?: number[]
  lineNumbers?: boolean
}

const Editor: React.FC<EditorProps> = props => {
  const { code, setCode, language } = usePlaygroundContext()
  const {
    className,
    fontSize = 16,
    disabled,
    theme,
    highlightedLines = [],
    addedLines = [],
    removedLines = [],
    warningLines = [],
    errorLines = [],
    focusedLines = [],
    lineNumbers,
  } = props

  return (
    <div className={clsx(className, styles.editor)}>
      <CodeEditor
        className={clsx({
          'has-focused-lines': focusedLines.length > 0,
          'has-line-numbers': lineNumbers,
        })}
        value={code}
        onValueChange={setCode}
        disabled={disabled}
        tabSize={2}
        padding={{ top: '2em', right: '2em', bottom: '2em', left: lineNumbers ? '5em' : '2em' }}
        style={{
          fontFamily: '"Fira Code", monospace',
          fontSize,
          outline: 'none',
          // plain 中包含一些预设样式
          ...(theme?.plain || {}),
        }}
        highlight={code => (
          <Highlight {...defaultProps} theme={theme} code={code} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <>
                {tokens.map((line, i) => (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    {...getLineProps({
                      line,
                      className: clsx({
                        highlighted: highlightedLines.includes(i + 1),
                        added: addedLines.includes(i + 1),
                        removed: removedLines.includes(i + 1),
                        warning: warningLines.includes(i + 1),
                        error: errorLines.includes(i + 1),
                        focused: focusedLines.includes(i + 1),
                      }),
                    })}
                    key={i}
                  >
                    <>
                      {lineNumbers && (
                        <span
                          className="line-number"
                          style={{
                            display: 'inline-block',
                            width: '3em',
                            marginLeft: '-3em',
                          }}
                        >
                          {i + 1}
                        </span>
                      )}
                      {line.map((token, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <span {...getTokenProps({ token })} key={i} />
                      ))}
                    </>
                  </div>
                ))}
              </>
            )}
          </Highlight>
        )}
      />
    </div>
  )
}

export default Editor
