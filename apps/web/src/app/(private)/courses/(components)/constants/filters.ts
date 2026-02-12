export const TAB_VALUES = {
  ALL: 'all',
  MY: 'my',
  NEW: 'new',
  RECOMMENDED: 'recommended',
} as const

export type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES]

export const COURSES_STATUS = {
  ALL: 'all',
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const

export type CoursesStatus = (typeof COURSES_STATUS)[keyof typeof COURSES_STATUS]

export const SORT_OPTIONS = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  POPULARITY: 'popularity',
  PROGRESS: 'progress',
} as const

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]

export interface CourseFiltersState {
  tab: TabValue
  search?: string
  status: CoursesStatus
  sort: SortOption
  authorId?: string
  skill?: string
}

export const DEFAULT_FILTERS: CourseFiltersState = {
  tab: TAB_VALUES.ALL,
  search: '',
  status: COURSES_STATUS.ALL,
  sort: SORT_OPTIONS.DATE_DESC,
  authorId: undefined,
  skill: undefined,
}

// Лейбли для UI

export const TAB_LABELS: Record<TabValue, string> = {
  [TAB_VALUES.ALL]: 'Всі курси',
  [TAB_VALUES.MY]: 'Мої курси',
  [TAB_VALUES.NEW]: 'Нові',
  [TAB_VALUES.RECOMMENDED]: 'Рекомендовані',
}

export const COURSES_STATUS_LABELS: Record<CoursesStatus, string> = {
  [COURSES_STATUS.ALL]: 'Всі',
  [COURSES_STATUS.NOT_STARTED]: 'Не розпочаті',
  [COURSES_STATUS.IN_PROGRESS]: 'В процесі',
  [COURSES_STATUS.COMPLETED]: 'Завершені',
}

export const SORT_OPTIONS_LABELS: Record<SortOption, string> = {
  [SORT_OPTIONS.DATE_DESC]: 'Спочатку нові',
  [SORT_OPTIONS.DATE_ASC]: 'Спочатку старі',
  [SORT_OPTIONS.TITLE_ASC]: 'За алфавітом (А-Я)',
  [SORT_OPTIONS.TITLE_DESC]: 'За алфавітом (Я-А)',
  [SORT_OPTIONS.POPULARITY]: 'За популярністю',
  [SORT_OPTIONS.PROGRESS]: 'За прогресом',
}
