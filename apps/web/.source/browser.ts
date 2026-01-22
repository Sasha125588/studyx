import type * as Config from '../source.config'
// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser'

const create = browser<typeof Config, import('fumadocs-mdx/runtime/types').InternalTypeConfig & {
  DocData: {
  }
}>()
const browserCollections = {
  docs: create.doc('docs', { 'index.mdx': () => import('../content/docs/index.mdx?collection=docs') }),
}
export default browserCollections
