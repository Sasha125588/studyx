import { FileIcon } from 'lucide-react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../base'

interface EmptyCardProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
}

export function EmptyCard({ icon, title, description, children }: EmptyCardProps) {
  const defaultIcon = (
    <FileIcon
      size={16}
      className="text-muted-foreground shrink-0"
    />
  )

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ?? defaultIcon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
