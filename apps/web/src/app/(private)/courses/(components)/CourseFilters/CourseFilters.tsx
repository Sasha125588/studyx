'use client'

import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import type { CoursesStatus, SortOption, TabValue } from '../constants/filters'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@studyx/ui/base'
import { RotateCcwIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'

import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/animate-ui/components/radix/tabs'
import {
  COURSES_STATUS,
  COURSES_STATUS_LABELS,

  SORT_OPTIONS,
  SORT_OPTIONS_LABELS,

  TAB_LABELS,
  TAB_VALUES,

} from '../constants/filters'
import { useCourseFilters } from '../hooks/useCourseFilters'

const SEARCH_DEBOUNCE_MS = 300

interface CourseFiltersProps {
  courses?: CourseWithDetails[]
  enrollments?: CourseEnrollment[]
}

export function CourseFilters({ courses = [], enrollments = [] }: CourseFiltersProps) {
  const {
    filters,
    authors,
    skills,
    setTab,
    setCoursesStatus,
    setSortBy,
    setAuthorId,
    setSkill,
    resetFilters,
    hasActiveFilters,
  } = useCourseFilters({ courses, enrollments })
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      throttleMs: SEARCH_DEBOUNCE_MS,
      shallow: false,
    }),
  )

  const handleClearSearch = () => {
    setSearch(null)
  }

  const tabValues = Object.values(TAB_VALUES) as TabValue[]
  const sortOptions = Object.values(SORT_OPTIONS) as SortOption[]
  const coursesStatuses = Object.values(COURSES_STATUS) as CoursesStatus[]

  return (
    <div className="space-y-4">
      {/* Таби та пошук */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={filters.tab}
          onValueChange={value => setTab(value as TabValue)}
        >
          <TabsList>
            {tabValues.map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
              >
                {TAB_LABELS[tab]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          {/* Пошук */}
          <div className="relative w-full sm:w-72">
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="size-4" />
            </div>
            <Input
              type="search"
              placeholder="Пошук курсу..."
              value={search}
              onChange={e => setSearch(e.target.value || null)}
              className="h-9 rounded-full pr-9 pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-300 ease-in-out"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          {/* Кнопка фільтрів */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={` ${showFilters && 'cursor-pointer border-indigo-500/50 bg-indigo-500/25 hover:bg-indigo-500/35 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 hover:dark:bg-indigo-900/60'}`}
          >
            <SlidersHorizontalIcon className="mr-2 size-4" />
            Фільтри
            {hasActiveFilters && (
              <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Панель фільтрів */}
      {showFilters && (
        <div className="animate-in slide-in-from-top-2 fade-in rounded-xl border p-4 shadow-sm duration-200">
          <div className="flex flex-wrap items-end gap-4">
            {/* Підфільтр для "Мої курси" */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Статус</label>
              <Select
                value={filters.coursesStatus}
                onValueChange={value => setCoursesStatus(value as CoursesStatus)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coursesStatuses.map(status => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {COURSES_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Фільтр за автором */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Автор</label>
              <Select
                value={filters.authorId || 'all'}
                onValueChange={value => setAuthorId(value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Всі автори" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі автори</SelectItem>
                  {authors.map(author => (
                    <SelectItem
                      key={author.id}
                      value={author.id}
                    >
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Фільтр за навичкою */}

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Навичка</label>
              <Select
                value={filters.skill || 'all'}
                onValueChange={value => setSkill(value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Всі навички" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі навички</SelectItem>
                  {skills.map(skill => (
                    <SelectItem
                      key={skill}
                      value={skill}
                    >
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Сортування */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Сортування</label>
              <Select
                value={filters.sort}
                onValueChange={value => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem
                      key={option}
                      value={option}
                    >
                      {SORT_OPTIONS_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Скинути фільтри */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcwIcon className="mr-1.5 size-4" />
                Скинути
              </Button>
            )}
            {/* Кількість результатів */}
            <div className="ml-auto text-sm">
              Знайдено:
              {' '}
              <span className="font-semibold">{courses.length}</span>
              {' '}
              {courses.length === 1 ? 'курс' : courses.length < 5 ? 'курси' : 'курсів'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
