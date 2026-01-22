import type { TabsContentProps as TabsContentPrimitiveProps, TabsContentsProps as TabsContentsPrimitiveProps, TabsListProps as TabsListPrimitiveProps, TabsProps as TabsPrimitiveProps, TabsTriggerProps as TabsTriggerPrimitiveProps } from '@/components/animate-ui/primitives/radix/tabs'

import * as React from 'react'
import {
  TabsContent as TabsContentPrimitive,

  TabsContents as TabsContentsPrimitive,

  TabsHighlightItem as TabsHighlightItemPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsList as TabsListPrimitive,

  Tabs as TabsPrimitive,

  TabsTrigger as TabsTriggerPrimitive,

} from '@/components/animate-ui/primitives/radix/tabs'

import { cn } from '@/shared/helpers'

type TabsProps = TabsPrimitiveProps

function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

type TabsListProps = TabsListPrimitiveProps

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsHighlightPrimitive className="dark:bg-primary bg-primary absolute inset-0 z-0 rounded-lg shadow-sm">
      <TabsListPrimitive
        className={cn(
          'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[4px]',
          className,
        )}
        {...props}
      />
    </TabsHighlightPrimitive>
  )
}

type TabsTriggerProps = TabsTriggerPrimitiveProps

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsHighlightItemPrimitive
      value={props.value}
      className="flex-1"
    >
      <TabsTriggerPrimitive
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] w-full flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-300 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
          className,
        )}
        {...props}
      />
    </TabsHighlightItemPrimitive>
  )
}

type TabsContentsProps = TabsContentsPrimitiveProps

function TabsContents(props: TabsContentsProps) {
  return <TabsContentsPrimitive {...props} />
}

type TabsContentProps = TabsContentPrimitiveProps

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsContentPrimitive
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsContent,
  type TabsContentProps,
  TabsContents,
  type TabsContentsProps,
  TabsList,
  type TabsListProps,
  type TabsProps,
  TabsTrigger,
  type TabsTriggerProps,
}
