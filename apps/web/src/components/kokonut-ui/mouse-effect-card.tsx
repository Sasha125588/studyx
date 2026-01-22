'use client'

/**
 * @author: @dorian_baffier
 * @description: Mouse Effect Card - Interactive card with animated dot pattern that responds to mouse movement
 * @version: 1.0.0
 * @date: 2025-01-30
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */
import { Card, CardContent } from '@studyx/ui/base'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/helpers'

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 }
const OPACITY_DURATION_BASE = 0.8
const OPACITY_DURATION_VARIATION = 0.2
const OPACITY_EASE = [0.4, 0, 0.2, 1] as const
const OPACITY_DELAY_CYCLE = 1.5
const OPACITY_DELAY_STEP = 0.02
const MIN_OPACITY_MULTIPLIER = 0.5
const MAX_OPACITY_MULTIPLIER = 1.5
const MIN_OPACITY_FALLBACK = 0.3
const PROXIMITY_MULTIPLIER = 1.2
const PROXIMITY_OPACITY_BOOST = 0.8

export interface MouseEffectCardProps {
  className?: string
  children?: React.ReactNode
  dotSize?: number
  dotSpacing?: number
  repulsionRadius?: number
  repulsionStrength?: number
  maxDots?: number
}

interface Dot {
  id: string
  x: number
  y: number
  baseX: number
  baseY: number
  opacity: number
}

interface DotComponentProps {
  dot: Dot
  index: number
  dotSize: number
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  repulsionRadius: number
  repulsionStrength: number
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

function generateDots(width: number, height: number, _spacing: number, maxDots: number): Dot[] {
  const dots: Dot[] = []
  const centerX = width / 2
  const centerY = height / 2
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
  const padding = 10

  for (let i = 0; i < maxDots; i++) {
    const x = padding + Math.random() * (width - padding * 2)
    const y = padding + Math.random() * (height - padding * 2)

    const dx = x - centerX
    const dy = y - centerY
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)
    const edgeFactor = Math.max(0.3, 1 - distanceFromCenter / maxDistance)

    const opacity = 0.2 + Math.random() * 0.5

    dots.push({
      id: `dot-${i}`,
      x,
      y,
      baseX: x,
      baseY: y,
      opacity: opacity * edgeFactor,
    })
  }

  return dots
}

function DotComponentBase({
  dot,
  index,
  dotSize,
  mouseX,
  mouseY,
  repulsionRadius,
  repulsionStrength,
}: DotComponentProps) {
  const posX = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get()
    const my = mouseY.get()

    if (!Number.isFinite(mx) || !Number.isFinite(my)) {
      return 0
    }

    const dx = dot.baseX - mx
    const dy = dot.baseY - my
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < repulsionRadius) {
      const force = (1 - distance / repulsionRadius) * repulsionStrength
      const angle = Math.atan2(dy, dx)
      return Math.cos(angle) * force
    }

    return 0
  })

  const posY = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get()
    const my = mouseY.get()

    if (!Number.isFinite(mx) || !Number.isFinite(my)) {
      return 0
    }

    const dx = dot.baseX - mx
    const dy = dot.baseY - my
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < repulsionRadius) {
      const force = (1 - distance / repulsionRadius) * repulsionStrength
      const angle = Math.atan2(dy, dx)
      return Math.sin(angle) * force
    }

    return 0
  })

  const opacityBoost = useTransform([mouseX, mouseY], () => {
    const mx = mouseX.get()
    const my = mouseY.get()

    if (!Number.isFinite(mx) || !Number.isFinite(my))
      return 0

    const distance = calculateDistance(dot.baseX, dot.baseY, mx, my)
    const maxDistance = repulsionRadius * PROXIMITY_MULTIPLIER

    if (distance < maxDistance) {
      const proximityFactor = 1 - distance / maxDistance
      return proximityFactor * PROXIMITY_OPACITY_BOOST
    }

    return 0
  })

  const x = useSpring(posX, SPRING_CONFIG)
  const y = useSpring(posY, SPRING_CONFIG)

  const baseMinOpacity = Math.max(dot.opacity * MIN_OPACITY_MULTIPLIER, MIN_OPACITY_FALLBACK)
  const baseMaxOpacity = Math.min(dot.opacity * MAX_OPACITY_MULTIPLIER, 1)

  const minOpacityWithBoost = useTransform(opacityBoost, boost =>
    Math.min(baseMinOpacity + boost, 1))

  const delay = (index * OPACITY_DELAY_STEP) % OPACITY_DELAY_CYCLE

  return (
    <motion.div
      className="absolute rounded-full bg-zinc-400 will-change-transform dark:bg-zinc-600"
      style={{
        width: dotSize,
        height: dotSize,
        left: dot.baseX,
        top: dot.baseY,
        x,
        y,
        opacity: useSpring(minOpacityWithBoost, {
          stiffness: 150,
          damping: 25,
        }),
      }}
      initial={{ opacity: baseMinOpacity }}
      animate={{
        opacity: [baseMinOpacity, baseMaxOpacity, baseMinOpacity],
      }}
      transition={{
        opacity: {
          duration: OPACITY_DURATION_BASE + (index % 4) * OPACITY_DURATION_VARIATION,
          repeat: Infinity,
          ease: OPACITY_EASE,
          delay,
          times: [0, 0.5, 1],
        },
      }}
    />
  )
}

const DotComponent = memo(DotComponentBase)

export function MouseEffectCard({
  className,
  children,
  dotSize = 3,
  dotSpacing = 6,
  repulsionRadius = 80,
  repulsionStrength = 20,
  maxDots = 50,
}: MouseEffectCardProps) {
  const innerContainerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(Infinity)
  const mouseY = useMotionValue(Infinity)
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    const updateDots = () => {
      if (!innerContainerRef.current)
        return
      const rect = innerContainerRef.current.getBoundingClientRect()
      const newDots = generateDots(rect.width, rect.height, dotSpacing, maxDots)
      setDots(newDots)
    }

    updateDots()

    const resizeObserver = new ResizeObserver(updateDots)
    if (innerContainerRef.current) {
      resizeObserver.observe(innerContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [dotSpacing, maxDots])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerContainerRef.current)
      return

    const rect = innerContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(Infinity)
    mouseY.set(Infinity)
  }

  return (
    <Card className={cn('p-0', className)}>
      <CardContent
        ref={innerContainerRef}
        className="relative w-full overflow-hidden p-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0">
          {dots.map((dot, index) => (
            <DotComponent
              key={dot.id}
              dot={dot}
              index={index}
              dotSize={dotSize}
              mouseX={mouseX}
              mouseY={mouseY}
              repulsionRadius={repulsionRadius}
              repulsionStrength={repulsionStrength}
            />
          ))}
        </div>

        <div className="relative z-10">{children}</div>
      </CardContent>
    </Card>
  )
}
