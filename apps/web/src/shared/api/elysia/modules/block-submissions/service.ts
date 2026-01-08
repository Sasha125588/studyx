import type { Database, Json } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

interface CreateSubmissionData {
	lessonId: number
	blockId: string
	userId: string
	submissionType: 'code' | 'file' | 'quiz'
	content: Json
	maxScore: number
}

interface GradeSubmissionData {
	score: number
	feedback?: string
	gradedBy: string
}

export class BlockSubmissionService {
	constructor(private supabase: SupabaseClient<Database>) {}
	/**
	 * Создать или обновить submission
	 */
	async upsert(data: CreateSubmissionData) {
		const { data: submission, error } = await this.supabase
			.from('block_submissions')
			.upsert(
				{
					lesson_id: data.lessonId,
					block_id: data.blockId,
					user_id: data.userId,
					submission_type: data.submissionType,
					content: data.content,
					max_score: data.maxScore,
					updated_at: new Date().toISOString()
				},
				{
					onConflict: 'lesson_id,block_id,user_id'
				}
			)
			.select()
			.single()

		if (error) throw new Error(error.message)
		return submission
	}

	/**
	 * Получить submission по id
	 */
	async getById(id: string) {
		const { data, error } = await this.supabase
			.from('block_submissions')
			.select('*')
			.eq('id', id)
			.single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Получить все submissions пользователя для урока
	 */
	async getByLessonAndUser(lessonId: number, userId: string) {
		const { data, error } = await this.supabase
			.from('block_submissions')
			.select('*')
			.eq('lesson_id', lessonId)
			.eq('user_id', userId)

		if (error) throw new Error(error.message)

		return data.map(submission => ({
			blockId: submission.block_id,
			content: submission.content,
			createdAt: submission.created_at,
			feedback: submission.feedback,
			gradedAt: submission.graded_at,
			gradedBy: submission.graded_by,
			id: submission.id,
			lessonId: submission.lesson_id,
			maxScore: submission.max_score,
			score: submission.score,
			submissionType: submission.submission_type,
			updatedAt: submission.updated_at,
			userId: submission.user_id
		}))
	}

	/**
	 * Получить все submissions для урока (для преподавателя)
	 */
	async getByLesson(lessonId: number) {
		const { data, error } = await this.supabase
			.from('block_submissions')
			.select(
				`
				*,
				user:user_id (
					id,
					name,
					email,
					image
				)
			`
			)
			.eq('lesson_id', lessonId)
			.order('created_at', { ascending: false })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Получить непроверенные submissions (для преподавателя)
	 */
	async getUngraded(limit = 50) {
		const { data, error } = await this.supabase
			.from('block_submissions')
			.select(
				`
				*,
				user:user_id (
					id,
					name,
					email,
					image
				),
				lesson:lesson_id (
					id,
					title,
					slug
				)
			`
			)
			.is('score', null)
			.order('created_at', { ascending: true })
			.limit(limit)

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Оценить submission
	 */
	async grade(id: string, data: GradeSubmissionData) {
		const { data: submission, error } = await this.supabase
			.from('block_submissions')
			.update({
				score: data.score,
				feedback: data.feedback,
				graded_by: data.gradedBy,
				graded_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single()

		if (error) throw new Error(error.message)
		return submission
	}

	/**
	 * Удалить submission
	 */
	async delete(id: string) {
		const { error } = await this.supabase.from('block_submissions').delete().eq('id', id)

		if (error) throw new Error(error.message)
		return { success: true }
	}

	/**
	 * Получить статистику по уроку
	 */
	async getLessonStats(lessonId: number) {
		const { data, error } = await this.supabase
			.from('block_submissions')
			.select('block_id, score, max_score')
			.eq('lesson_id', lessonId)

		if (error) throw new Error(error.message)

		const totalSubmissions = data.length
		const gradedSubmissions = data.filter(s => s.score !== null).length
		const ungradedSubmissions = totalSubmissions - gradedSubmissions

		const averageScore =
			gradedSubmissions > 0
				? data.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) /
					gradedSubmissions
				: 0

		return {
			totalSubmissions,
			gradedSubmissions,
			ungradedSubmissions,
			averageScore
		}
	}
}
