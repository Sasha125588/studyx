export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '13.0.4'
	}
	public: {
		Tables: {
			account: {
				Row: {
					accessToken: string | null
					accessTokenExpiresAt: string | null
					accountId: string
					createdAt: string
					id: string
					idToken: string | null
					password: string | null
					providerId: string
					refreshToken: string | null
					refreshTokenExpiresAt: string | null
					scope: string | null
					updatedAt: string
					userId: string
				}
				Insert: {
					accessToken?: string | null
					accessTokenExpiresAt?: string | null
					accountId: string
					createdAt: string
					id: string
					idToken?: string | null
					password?: string | null
					providerId: string
					refreshToken?: string | null
					refreshTokenExpiresAt?: string | null
					scope?: string | null
					updatedAt: string
					userId: string
				}
				Update: {
					accessToken?: string | null
					accessTokenExpiresAt?: string | null
					accountId?: string
					createdAt?: string
					id?: string
					idToken?: string | null
					password?: string | null
					providerId?: string
					refreshToken?: string | null
					refreshTokenExpiresAt?: string | null
					scope?: string | null
					updatedAt?: string
					userId?: string
				}
				Relationships: [
					{
						foreignKeyName: 'account_userId_fkey'
						columns: ['userId']
						isOneToOne: false
						referencedRelation: 'user'
						referencedColumns: ['id']
					}
				]
			}
			course_authors: {
				Row: {
					author_name: string | null
					course_id: number | null
					created_at: string
					id: number
					user_id: string | null
				}
				Insert: {
					author_name?: string | null
					course_id?: number | null
					created_at?: string
					id?: number
					user_id?: string | null
				}
				Update: {
					author_name?: string | null
					course_id?: number | null
					created_at?: string
					id?: number
					user_id?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'course_authors_course_id_fkey'
						columns: ['course_id']
						isOneToOne: false
						referencedRelation: 'courses'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'course_authors_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'user'
						referencedColumns: ['id']
					}
				]
			}
			courses: {
				Row: {
					created_at: string | null
					description: string | null
					edu_program: string | null
					id: number
					slug: string | null
					title: string | null
				}
				Insert: {
					created_at?: string | null
					description?: string | null
					edu_program?: string | null
					id?: number
					slug?: string | null
					title?: string | null
				}
				Update: {
					created_at?: string | null
					description?: string | null
					edu_program?: string | null
					id?: number
					slug?: string | null
					title?: string | null
				}
				Relationships: []
			}
			group_members: {
				Row: {
					group_id: number | null
					id: number
					role: string | null
					user_id: string | null
				}
				Insert: {
					group_id?: number | null
					id?: number
					role?: string | null
					user_id?: string | null
				}
				Update: {
					group_id?: number | null
					id?: number
					role?: string | null
					user_id?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'group_members_group_id_fkey'
						columns: ['group_id']
						isOneToOne: false
						referencedRelation: 'groups'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'group_members_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'user'
						referencedColumns: ['id']
					}
				]
			}
			groups: {
				Row: {
					created_at: string
					id: number
					name: string
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: number
					name: string
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: number
					name?: string
					updated_at?: string
				}
				Relationships: []
			}
			lesson_attachments: {
				Row: {
					created_at: string
					id: number
					lesson_id: number | null
					order_index: number | null
					title: string | null
					type: string | null
					url: string | null
				}
				Insert: {
					created_at?: string
					id?: number
					lesson_id?: number | null
					order_index?: number | null
					title?: string | null
					type?: string | null
					url?: string | null
				}
				Update: {
					created_at?: string
					id?: number
					lesson_id?: number | null
					order_index?: number | null
					title?: string | null
					type?: string | null
					url?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'lesson_attachments_lesson_id_fkey'
						columns: ['lesson_id']
						isOneToOne: false
						referencedRelation: 'lessons'
						referencedColumns: ['id']
					}
				]
			}
			lessons: {
				Row: {
					content: string | null
					created_at: string
					id: number
					module_id: number | null
					order_index: number | null
					title: string | null
					type: string | null
					updated_at: string | null
				}
				Insert: {
					content?: string | null
					created_at?: string
					id?: number
					module_id?: number | null
					order_index?: number | null
					title?: string | null
					type?: string | null
					updated_at?: string | null
				}
				Update: {
					content?: string | null
					created_at?: string
					id?: number
					module_id?: number | null
					order_index?: number | null
					title?: string | null
					type?: string | null
					updated_at?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'lectures_module_id_fkey'
						columns: ['module_id']
						isOneToOne: false
						referencedRelation: 'modules'
						referencedColumns: ['id']
					}
				]
			}
			modules: {
				Row: {
					course_id: number | null
					created_at: string
					description: string | null
					id: number
					name: string | null
				}
				Insert: {
					course_id?: number | null
					created_at?: string
					description?: string | null
					id?: number
					name?: string | null
				}
				Update: {
					course_id?: number | null
					created_at?: string
					description?: string | null
					id?: number
					name?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'module_course_id_fkey'
						columns: ['course_id']
						isOneToOne: false
						referencedRelation: 'courses'
						referencedColumns: ['id']
					}
				]
			}
			session: {
				Row: {
					createdAt: string
					expiresAt: string
					id: string
					ipAddress: string | null
					token: string
					updatedAt: string
					userAgent: string | null
					userId: string
				}
				Insert: {
					createdAt: string
					expiresAt: string
					id: string
					ipAddress?: string | null
					token: string
					updatedAt: string
					userAgent?: string | null
					userId: string
				}
				Update: {
					createdAt?: string
					expiresAt?: string
					id?: string
					ipAddress?: string | null
					token?: string
					updatedAt?: string
					userAgent?: string | null
					userId?: string
				}
				Relationships: [
					{
						foreignKeyName: 'session_userId_fkey'
						columns: ['userId']
						isOneToOne: false
						referencedRelation: 'user'
						referencedColumns: ['id']
					}
				]
			}
			user: {
				Row: {
					createdAt: string
					email: string
					emailVerified: boolean
					id: string
					image: string | null
					name: string
					updatedAt: string
				}
				Insert: {
					createdAt: string
					email: string
					emailVerified: boolean
					id: string
					image?: string | null
					name: string
					updatedAt: string
				}
				Update: {
					createdAt?: string
					email?: string
					emailVerified?: boolean
					id?: string
					image?: string | null
					name?: string
					updatedAt?: string
				}
				Relationships: []
			}
			verification: {
				Row: {
					createdAt: string | null
					expiresAt: string
					id: string
					identifier: string
					updatedAt: string | null
					value: string
				}
				Insert: {
					createdAt?: string | null
					expiresAt: string
					id: string
					identifier: string
					updatedAt?: string | null
					value: string
				}
				Update: {
					createdAt?: string | null
					expiresAt?: string
					id?: string
					identifier?: string
					updatedAt?: string | null
					value?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {}
	}
} as const
