// ============================================
// ТИПЫ БЛОКОВ ДЛЯ КОНСТРУКТОРА УРОКОВ
// ============================================
import type { BlockSubmissionDB, SubmissionType } from './entities'

// Поддерживаемые языки программирования
export type CodeLanguage =
	| 'javascript'
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

export const CODE_LANGUAGES: { value: CodeLanguage; label: string }[] = [
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
	{ value: 'rust', label: 'Rust' }
]

// Типы блоков
export type BlockType =
	| 'text'
	| 'heading'
	| 'image'
	| 'video'
	| 'callout'
	| 'divider'
	| 'code'
	| 'code-exercise'
	| 'file-upload'
	| 'quiz'

// ============================================
// БАЗОВЫЙ ИНТЕРФЕЙС БЛОКА
// ============================================

interface BaseBlock {
	id: string // nanoid для уникальности
	type: BlockType
}

// ============================================
// КОНТЕНТНЫЕ БЛОКИ
// ============================================

export interface TextBlock extends BaseBlock {
	type: 'text'
	content: string // HTML или markdown
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
	width?: number // в процентах или пикселях
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
	content: string // markdown
}

export interface DividerBlock extends BaseBlock {
	type: 'divider'
}

// ============================================
// ИНТЕРАКТИВНЫЕ БЛОКИ
// ============================================

export interface CodeBlock extends BaseBlock {
	type: 'code'
	language: CodeLanguage
	code: string
	filename?: string // опциональное имя файла для отображения
	readonly: boolean // true = только для чтения (пример кода)
	runnable: boolean // true = можно запустить
}

export interface CodeExerciseBlock extends BaseBlock {
	type: 'code-exercise'
	language: CodeLanguage
	instructions: string // описание задания (markdown)
	starterCode: string // начальный код для студента
	solutionCode?: string // правильное решение (для преподавателя)
	expectedOutput?: string // ожидаемый вывод (опционально)
	maxScore: number // максимальный балл за задание
}

export interface FileUploadBlock extends BaseBlock {
	type: 'file-upload'
	instructions: string // описание того, что нужно загрузить
	allowedTypes: string[] // ['pdf'] или ['pdf', 'docx', 'zip']
	maxFiles: number // максимальное количество файлов
	maxSizeMB: number // максимальный размер одного файла в MB
	maxScore: number // максимальный балл за задание
}

// ============================================
// QUIZ БЛОК
// ============================================

export type QuizQuestionType = 'single' | 'multiple' | 'text'

export interface QuizOption {
	id: string
	text: string
	isCorrect: boolean
}

export interface QuizQuestion {
	id: string
	text: string // текст вопроса (markdown)
	type: QuizQuestionType
	options?: QuizOption[] // для single/multiple choice
	correctAnswer?: string // для text type
	points: number // баллы за правильный ответ
	explanation?: string // объяснение правильного ответа
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

// ============================================
// ОБЪЕДИНЁННЫЙ ТИП БЛОКА
// ============================================

export type LessonBlock =
	| TextBlock
	| HeadingBlock
	| ImageBlock
	| VideoBlock
	| CalloutBlock
	| DividerBlock
	| CodeBlock
	| CodeExerciseBlock
	| FileUploadBlock
	| QuizBlock

// ============================================
// ХЕЛПЕРЫ
// ============================================

// Type guard для проверки типа блока
export function isBlockType<T extends BlockType>(
	block: LessonBlock,
	type: T
): block is Extract<LessonBlock, { type: T }> {
	return block.type === type
}

// Проверка, является ли блок интерактивным (требует ответа студента)
export function isInteractiveBlock(
	block: LessonBlock
): block is CodeExerciseBlock | FileUploadBlock | QuizBlock {
	return block.type === 'code-exercise' || block.type === 'file-upload' || block.type === 'quiz'
}

// Подсчёт максимального балла за урок
export function calculateLessonMaxScore(blocks: LessonBlock[]): number {
	return blocks.reduce((total, block) => {
		if (block.type === 'code-exercise' || block.type === 'file-upload') {
			return total + block.maxScore
		}
		if (block.type === 'quiz') {
			return total + block.questions.reduce((sum, q) => sum + q.points, 0)
		}
		return total
	}, 0)
}

// ============================================
// ТИПЫ ДЛЯ ОТВЕТОВ СТУДЕНТОВ
// ============================================

export interface CodeSubmission {
	type: 'code'
	code: string
	language: CodeLanguage
	output?: string // результат выполнения
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
		selectedOptionIds?: string[] // для single/multiple
		textAnswer?: string // для text
	}[]
	submittedAt: string
	autoScore?: number // автоматически подсчитанный балл
}

export type BlockSubmissionContent = CodeSubmission | FileSubmission | QuizSubmission

// export interface BlockSubmission {
// 	id: string
// 	lessonId: number
// 	blockId: string
// 	userId: string
// 	submissionType: SubmissionType
// 	content: BlockSubmissionContent
// 	score: number | null
// 	maxScore: number
// 	feedback: string | null
// 	gradedBy: string | null
// 	gradedAt: string | null
// 	createdAt: string
// 	updatedAt: string
// }

export type BlockSubmissionCamel = Camelize<BlockSubmissionDB>

export type BlockSubmission = Omit<BlockSubmissionCamel, 'content'> & {
	content: BlockSubmissionContent
}

type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
	: S

export type Camelize<T> = {
	[K in keyof T as SnakeToCamel<K & string>]: T[K]
}
