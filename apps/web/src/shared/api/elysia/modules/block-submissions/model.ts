import { Elysia, t } from 'elysia'

// Схемы для разных типов контента submission
const CodeSubmissionContent = t.Object({
	type: t.Literal('code'),
	code: t.String(),
	language: t.String(),
	output: t.Optional(t.String()),
	executedAt: t.Optional(t.String())
})

const FileSubmissionContent = t.Object({
	type: t.Literal('file'),
	files: t.Array(
		t.Object({
			id: t.String(),
			filename: t.String(),
			originalFilename: t.String(),
			mimeType: t.String(),
			sizeBytes: t.Number(),
			storagePath: t.String(),
			uploadedAt: t.String()
		})
	)
})

const QuizSubmissionContent = t.Object({
	type: t.Literal('quiz'),
	answers: t.Array(
		t.Object({
			questionId: t.String(),
			selectedOptionIds: t.Optional(t.Array(t.String())),
			textAnswer: t.Optional(t.String())
		})
	),
	submittedAt: t.String(),
	autoScore: t.Optional(t.Number())
})

const SubmissionContent = t.Union([
	CodeSubmissionContent,
	FileSubmissionContent,
	QuizSubmissionContent
])

const BlockSubmission = t.Object({
	id: t.String(),
	lesson_id: t.Number(),
	block_id: t.String(),
	user_id: t.String(),
	submission_type: t.Union([t.Literal('code'), t.Literal('file'), t.Literal('quiz')]),
	content: SubmissionContent,
	score: t.Nullable(t.Number()),
	max_score: t.Number(),
	feedback: t.Nullable(t.String()),
	graded_by: t.Nullable(t.String()),
	graded_at: t.Nullable(t.String()),
	created_at: t.String(),
	updated_at: t.String()
})

const User = t.Object({
	id: t.String(),
	name: t.String(),
	email: t.String(),
	image: t.Nullable(t.String())
})

const BlockSubmissionWithUser = t.Composite([
	BlockSubmission,
	t.Object({
		user: User
	})
])

export const BlockSubmissionModel = new Elysia({ name: 'Model.BlockSubmission' }).model({
	'blockSubmission.base': BlockSubmission,
	'blockSubmission.withUser': BlockSubmissionWithUser,
	'blockSubmission.content': SubmissionContent,

	// Параметры запросов
	'blockSubmission.params.id': t.Object({
		id: t.String()
	}),
	'blockSubmission.params.lessonId': t.Object({
		lessonId: t.Numeric()
	}),

	// Тело запросов
	'blockSubmission.create': t.Object({
		lessonId: t.Number(),
		blockId: t.String(),
		submissionType: t.Union([t.Literal('code'), t.Literal('file'), t.Literal('quiz')]),
		content: SubmissionContent,
		maxScore: t.Number()
	}),

	'blockSubmission.update': t.Object({
		content: t.Optional(SubmissionContent)
	}),

	'blockSubmission.grade': t.Object({
		score: t.Number(),
		feedback: t.Optional(t.String())
	})
})
