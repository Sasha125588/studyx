import Link from 'next/link'

import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '../../base'

interface NotFoundCardProps {
  title?: string
  description?: string
}

export function NotFoundCard({ title, description }: NotFoundCardProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title ?? '404 - Not Found'}</EmptyTitle>
        <EmptyDescription>
          {description ?? 'Сторінку, яку ви шукаєте, не знайдено.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          asChild
        >
          <Link href="/">На головну</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
