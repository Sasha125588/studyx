import type { Metadata } from 'next'
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
  DocsPage as FumadocsDocsPage,
} from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import { notFound } from 'next/navigation'

import { source } from '@/lib/source'

import { getMDXComponents } from '../../../mdx-components'

async function DocsPage(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  const MDX = page.data.body

  return (
    <FumadocsDocsPage
      toc={page.data.toc}
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="wysiwyg prose dark:prose-invert">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </FumadocsDocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default DocsPage
