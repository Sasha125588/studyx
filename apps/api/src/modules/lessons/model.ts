import { Elysia, t } from 'elysia'

const LessonAttachment = t.Object({
	id: t.Number(),
	lesson_id: t.Nullable(t.Number()),
	title: t.Nullable(t.String()),
	url: t.Nullable(t.String()),
	type: t.Nullable(t.String()),
	order_index: t.Nullable(t.Number()),
	created_at: t.String()
})

// Схема блока (упрощённая для валидации)
const LessonBlockSchema = t.Object(
	{
		id: t.String(),
		type: t.String()
		// Остальные поля зависят от типа блока, поэтому используем additionalProperties
	},
	{ additionalProperties: true }
)

const Lesson = t.Object({
	id: t.Number(),
	module_id: t.Nullable(t.Number()),
	title: t.Nullable(t.String()),
	slug: t.Nullable(t.String()),
	content: t.Nullable(t.String()), // TODO: deprecated
	blocks: t.Array(LessonBlockSchema),
	estimated_time_minutes: t.Nullable(t.Number()),
	type: t.Nullable(t.Union([t.Literal('lecture'), t.Literal('practical'), t.Literal('test')])),
	order_index: t.Nullable(t.Number()),
	created_at: t.String(),
	updated_at: t.Nullable(t.String())
})

const LessonWithAttachments = t.Composite([
	Lesson,
	t.Object({
		lesson_attachments: t.Array(LessonAttachment)
	})
])

const LessonNavItem = t.Object({
	id: t.Number(),
	title: t.Nullable(t.String()),
	slug: t.Nullable(t.String()),
	type: t.Nullable(t.Union([t.Literal('lecture'), t.Literal('practical')])),
	order_index: t.Number()
})

const ModuleWithLessonsNav = t.Object({
	id: t.Number(),
	name: t.Nullable(t.String()),
	order_index: t.Number(),
	lessons: t.Array(LessonNavItem)
})

const LessonFullContext = t.Object({
	lesson: t.Composite([
		Lesson,
		t.Object({
			attachments: t.Array(LessonAttachment)
		})
	]),
	module: t.Object({
		id: t.Number(),
		name: t.Nullable(t.String()),
		description: t.Nullable(t.String()),
		order_index: t.Number(),
		course_id: t.Nullable(t.Number())
	}),
	course: t.Object({
		id: t.Number(),
		title: t.Nullable(t.String()),
		slug: t.String()
	}),
	moduleLessons: t.Array(LessonNavItem),
	allModules: t.Array(ModuleWithLessonsNav),
	navigation: t.Object({
		previous: t.Nullable(LessonNavItem),
		next: t.Nullable(LessonNavItem),
		currentIndex: t.Number(),
		totalLessons: t.Number()
	})
})

export const LessonModel = new Elysia({ name: 'Model.Lesson' }).model({
	'lesson.base': Lesson,
	'lesson.attachment': LessonAttachment,
	'lesson.withAttachments': LessonWithAttachments,
	'lesson.fullContext': LessonFullContext,
	'lesson.params.id': t.Object({
		id: t.Numeric()
	}),
	'lesson.params.slugs': t.Object({
		courseSlug: t.String(),
		lessonSlug: t.String()
	})
})

export type LessonType = typeof Lesson.static
export type LessonAttachmentType = typeof LessonAttachment.static
export type LessonWithAttachmentsType = typeof LessonWithAttachments.static
export type LessonFullContextType = typeof LessonFullContext.static
