import type * as Config from '../source.config'
import { server } from 'fumadocs-mdx/runtime/server'
// @ts-nocheck
import * as __fd_glob_0 from '../content/docs/index.mdx?collection=docs'

const create = server<typeof Config, import('fumadocs-mdx/runtime/types').InternalTypeConfig & {
  DocData: {
  }
}>({ doc: { passthroughs: ['extractedReferences'] } })

export const docs = await create.docs('docs', 'content/docs', {}, { 'index.mdx': __fd_glob_0 })
