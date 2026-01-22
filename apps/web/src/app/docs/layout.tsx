import { DocsLayout as FumadocsDocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions, source } from '@/lib/source'

function DocsLayout({ children }: LayoutProps<'/docs'>) {
  return (
    <FumadocsDocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
    >
      {children}
    </FumadocsDocsLayout>
  )
}

export default DocsLayout
