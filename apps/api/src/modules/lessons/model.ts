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

const Lesson = t.Object({
	id: t.Number(),
	module_id: t.Nullable(t.Number()),
	title: t.Nullable(t.String()),
	content: t.Nullable(t.String()),
	type: t.Nullable(t.Union([t.Literal('lecture'), t.Literal('practical')])),
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

export const LessonModel = new Elysia({ name: 'Model.Lesson' }).model({
	'lesson.base': Lesson,
	'lesson.attachment': LessonAttachment,
	'lesson.withAttachments': LessonWithAttachments,
	'lesson.params.id': t.Object({
		id: t.Numeric()
	})
})

export type LessonType = typeof Lesson.static
export type LessonAttachmentType = typeof LessonAttachment.static
export type LessonWithAttachmentsType = typeof LessonWithAttachments.static
