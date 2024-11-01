'use client'

import React, { useMemo } from 'react'
import SevenSegmentDisplayProvider from './Provider'
import Digit from './Digit'
import { DigitType } from './types'

export interface SevenSegmentDisplayProps {
  value: number
  minLength?: number
  digitSize?: number
  digitSpacing?: number
  segmentThickness?: number
  segmentSpacing?: number
  segmentActiveColor?: string
  segmentInactiveColor?: string
  backgroundColor?: string
  padding?: number | string
  glow?: boolean // 微光效果
}

const SevenSegmentDisplay: React.FC<SevenSegmentDisplayProps> = props => {
  const {
    value,
    minLength = 4,
    digitSize = 40,
    digitSpacing = digitSize / 4,
    segmentThickness = digitSize / 8,
    segmentSpacing = segmentThickness / 4,
    segmentActiveColor = '#adb0b8',
    segmentInactiveColor = '#eff1f5',
    backgroundColor = '#eff1f5',
    padding = digitSize / 4,
    glow = false,
  } = props

  const paddedValue = useMemo(() => value.toString().padStart(minLength, '0'), [value, minLength])
  const individualDigits = useMemo(() => paddedValue.split(''), [paddedValue])

  return (
    <SevenSegmentDisplayProvider
      digitSize={digitSize}
      segmentThickness={segmentThickness}
      segmentSpacing={segmentSpacing}
      segmentActiveColor={segmentActiveColor}
      segmentInactiveColor={segmentInactiveColor}
      glow={glow}
    >
      <div
        className="inline-flex items-center justify-between"
        style={{ padding, backgroundColor, gap: digitSpacing }}
      >
        {individualDigits.map((digit, idx) => (
          <Digit key={idx} value={Number(digit) as DigitType} />
        ))}
      </div>
    </SevenSegmentDisplayProvider>
  )
}

export default SevenSegmentDisplay
