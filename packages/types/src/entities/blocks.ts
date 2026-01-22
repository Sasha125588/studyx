/* eslint-disable style/max-len */
import type { BlockSubmissionDB } from '.'

export type CodeLanguage
  = | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'cpp'
    | 'csharp'
    | 'html'
    | 'css'
    | 'sql'
    | 'php'
    | 'go'
    | 'rust'

export const CODE_LANGUAGES: { value: CodeLanguage, label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
] as const

export type BlockType
  = | 'text'
    | 'heading'
    | 'image'
    | 'video'
    | 'callout'
    | 'divider'
    | 'code'
    | 'code-exercise'
    | 'file-upload'
    | 'quiz'

interface BaseBlock {
  id: string
  type: BlockType
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  content: string
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  level: 1 | 2 | 3
  text: string
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  url: string
  alt?: string
  caption?: string
  width?: number
}

export interface VideoBlock extends BaseBlock {
  type: 'video'
  url: string
  provider: 'youtube' | 'vimeo' | 'uploaded'
  caption?: string
}

export type CalloutVariant = 'info' | 'warning' | 'tip' | 'danger'

export interface CalloutBlock extends BaseBlock {
  type: 'callout'
  variant: CalloutVariant
  title?: string
  content: string
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
}

export interface CodeBlock extends BaseBlock {
  type: 'code'
  language: CodeLanguage
  code: string
  filename?: string
  readonly: boolean
  runnable: boolean // чи можна запустити код
}

export interface CodeExerciseBlock extends BaseBlock {
  type: 'code-exercise'
  language: CodeLanguage
  instructions: string
  starterCode: string // (студента)
  solutionCode?: string // правильне рішення (для викладача)
  expectedOutput?: string
  maxScore: number
}

export interface FileUploadBlock extends BaseBlock {
  type: 'file-upload'
  instructions: string // опис того, що потрібно завантажити
  allowedTypes: string[]
  maxFiles: number
  maxSizeMB: number
  maxScore: number
}

export type QuizQuestionType = 'single' | 'multiple' | 'text'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  type: QuizQuestionType
  options?: QuizOption[] // для single/multiple choice
  correctAnswer?: string
  points: number
  explanation?: string
}

export interface QuizBlock extends BaseBlock {
  type: 'quiz'
  title?: string
  questions: QuizQuestion[]
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  showCorrectAnswers?: boolean
  maxAttempts?: number
}

export type LessonBlock
  = | TextBlock
    | HeadingBlock
    | ImageBlock
    | VideoBlock
    | CalloutBlock
    | DividerBlock
    | CodeBlock
    | CodeExerciseBlock
    | FileUploadBlock
    | QuizBlock

export interface CodeSubmission {
  type: 'code'
  code: string
  language: CodeLanguage
  output?: string
  executedAt?: string
}

export interface FileSubmission {
  type: 'file'
  files: {
    id: string
    filename: string
    originalFilename: string
    mimeType: string
    sizeBytes: number
    storagePath: string
    uploadedAt: string
  }[]
}

export interface QuizSubmission {
  type: 'quiz'
  answers: {
    questionId: string
    selectedOptionIds?: string[]
    textAnswer?: string
  }[]
  submittedAt: string
  autoScore?: number
}

export type BlockSubmissionContent = CodeSubmission | FileSubmission | QuizSubmission

export type BlockSubmissionCamel = Camelize<BlockSubmissionDB>

export type BlockSubmission = Omit<BlockSubmissionCamel, 'content'> & {
  content: BlockSubmissionContent
}

export type Camelize<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K]
}

type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
  : S
