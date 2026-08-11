import React from 'react'

const HorizontalRule = () => {
  return (
    <svg
      className="block overflow-visible w-full max-w-[100px] h-[10px] mx-auto my-16 fill-none stroke-zinc-400/50"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="0" y1="0" x2="20" y2="10" />
      <line x1="20" y1="0" x2="40" y2="10" />
      <line x1="40" y1="0" x2="60" y2="10" />
      <line x1="60" y1="0" x2="80" y2="10" />
      <line x1="80" y1="0" x2="100" y2="10" />
    </svg>
    // <div className="h-px my-16 bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent"></div>
  )
}

export default HorizontalRule
