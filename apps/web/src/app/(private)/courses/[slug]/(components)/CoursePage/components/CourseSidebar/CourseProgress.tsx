'use client'

import { cn } from '@/shared/helpers/common/cn'

export interface CourseProgressProps {
  value: number
  completedLessons: number
  totalLessons: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { container: 'h-20 w-20', stroke: 6, radius: 34, text: 'text-lg', subtext: 'text-[10px]' },
  md: { container: 'h-28 w-28', stroke: 7, radius: 48, text: 'text-2xl', subtext: 'text-xs' },
  lg: { container: 'h-32 w-32', stroke: 8, radius: 56, text: 'text-3xl', subtext: 'text-xs' },
}

export function CourseProgress({
  value,
  completedLessons,
  totalLessons,
  size = 'lg',
  className,
}: CourseProgressProps) {
  const config = sizes[size]
  const circumference = 2 * Math.PI * config.radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative', config.container, className)}>
      <svg className="h-full w-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={config.radius}
          className="stroke-muted fill-none"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r={config.radius}
          className="stroke-primary fill-none transition-all duration-500 ease-out"
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', config.text)}>{completedLessons}</span>
        <span className={cn('text-muted-foreground', config.subtext)}>
          із
          {' '}
          {totalLessons}
          {' '}
          уроків
        </span>
      </div>
    </div>
  )
}
