import type { ImageBlock as ImageBlockType } from '@studyx/types'
import Image from 'next/image'

interface ImageBlockProps {
  block: ImageBlockType
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className="my-6">
      <div
        className="relative overflow-hidden rounded-xl border"
        style={{ width: block.width ? `${block.width}%` : '100%' }}
      >
        <Image
          src={block.url}
          alt={block.alt ?? ''}
          width={800}
          height={450}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}
