import db from '@/lib/supabase/client'

export const getCourse = async (courseID: string) => {
  return await db
    .from('course')
    .select(`
      *,
      module:module (
        *,
        lectures:lectures (
          *
        ),
        practical:practical (
          *
        )
      )
    `)
    .eq("id", +courseID)
    .single()
}
