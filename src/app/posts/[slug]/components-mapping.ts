import tagRenderer from '@/common/tag-renderer'
import Image from '@/components/Image'
import UnorderedList from '@/components/lists/UnorderedList'
import OrderedList from '@/components/lists/OrderedList'
import ListItem from '@/components/lists/ListItem'
import HorizontalRule from '@/components/HorizontalRule'
import CodeBlock from '@/components/CodeBlock'
import Link from '@/components/Link'
import LinkCard from '@/components/LinkCard'
import * as embeds from '@/components/embeds'
import DarkModeToggle from '@/components/DarkModeToggle'
import Sandpack from "@/components/Sandpack";
import { MDXComponents } from 'mdx/types'

const components = {
  h1: tagRenderer('h1'),
  h2: tagRenderer('h2'),
  h3: tagRenderer('h3'),
  h4: tagRenderer('h4'),
  h5: tagRenderer('h5'),
  h6: tagRenderer('h6'),
  p: tagRenderer('p'),
  blockquote: tagRenderer('blockquote'),
  table: tagRenderer('table'),
  thead: tagRenderer('thead'),
  tbody: tagRenderer('tbody'),
  tr: tagRenderer('tr'),
  th: tagRenderer('th'),
  td: tagRenderer('td'),
  em: tagRenderer('em'),
  strong: tagRenderer('strong'),
  del: tagRenderer('del'),
  img: Image,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  hr: HorizontalRule,
  code: CodeBlock,
  a: Link,
  linkcard: LinkCard,
  ...embeds,
  DarkModeToggle,
  Sandpack
} as unknown as MDXComponents

export default components
