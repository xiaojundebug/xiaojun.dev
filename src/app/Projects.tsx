import React from 'react'
import DesktopOnly from '@/components/DesktopOnly'
import { ArrowRight } from '@/components/icons'

const projects = [
  {
    name: 'xiaojun.dev',
    desc: 'The source code of this website',
    url: 'https://github.com/xiaojundebug/xiaojun.dev',
  },
  {
    name: 'unique-ui',
    desc: 'A mobile component library for Vue2.x',
    url: 'https://github.com/xiaojundebug/unique-ui',
  },
  {
    name: 'zhuangtai',
    desc: 'A scalable reactjs state management solution powered by RxJS',
    url: 'https://github.com/xiaojundebug/zhuangtai',
  },
  {
    name: 'ngx-popup',
    desc: 'An angular popup component with customizable animations',
    url: 'https://github.com/xiaojundebug/ngx-popup',
  },
  {
    name: 'ngx-carousel',
    desc: 'A simple angular carousel component',
    url: 'https://github.com/xiaojundebug/ngx-carousel',
  },
  {
    name: 'hammerspoon-config',
    desc: 'My hammerspoon scripts',
    url: 'https://github.com/xiaojundebug/hammerspoon-config',
  },
  {
    name: 'alfred-npm-search-workflow',
    desc: 'NPM Workflow for Alfred',
    url: 'https://github.com/xiaojundebug/alfred-npm-search-workflow',
  },
  {
    name: 'alfred-system-theme',
    desc: 'Alfred themes inspired on macOS',
    url: 'https://github.com/xiaojundebug/alfred-system-theme',
  },
]

const Projects = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 -mx-3 sm:-mx-4 mt-8">
      {projects.map(project => (
        <a
          className="group relative flex flex-col p-3 sm:p-4 gap-1.5 rounded-xl sm:hover:bg-zinc-400/10 transition-colors"
          key={project.name}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="font-medium">{project.name}</h3>
          <span className="text-zinc-400 dark:text-zinc-500">{project.desc}</span>
          <DesktopOnly>
            <ArrowRight className="absolute right-2.5 bottom-2.5 text-zinc-300 dark:text-zinc-600 -rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
          </DesktopOnly>
        </a>
      ))}
    </div>
  )
}

export default Projects
