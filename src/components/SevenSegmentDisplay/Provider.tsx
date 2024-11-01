import React, { createContext, PropsWithChildren } from 'react'
import { SevenSegmentDisplayProps } from '.'

export type SevenSegmentDisplayContext = Required<
  Pick<
    SevenSegmentDisplayProps,
    | 'digitSize'
    | 'segmentThickness'
    | 'segmentSpacing'
    | 'segmentActiveColor'
    | 'segmentInactiveColor'
    | 'glow'
  >
>

export interface SevenSegmentDisplayProviderProps extends SevenSegmentDisplayContext {}

export const SevenSegmentDisplayContext = createContext({} as SevenSegmentDisplayContext)

const SevenSegmentDisplayProvider: React.FC<
  PropsWithChildren<SevenSegmentDisplayProviderProps>
> = props => {
  const { children, ...rest } = props

  return (
    <SevenSegmentDisplayContext.Provider value={rest}>
      {children}
    </SevenSegmentDisplayContext.Provider>
  )
}

export default SevenSegmentDisplayProvider
