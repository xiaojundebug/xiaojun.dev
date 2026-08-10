import React from 'react'
import { IconProps } from './types'

const Sparkles: React.FC<IconProps> = props => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M12 2l1.9 5.7a2 2 0 001.3 1.3L21 11l-5.8 2a2 2 0 00-1.3 1.3L12 20l-1.9-5.7a2 2 0 00-1.3-1.3L3 11l5.8-2a2 2 0 001.3-1.3L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Sparkles
