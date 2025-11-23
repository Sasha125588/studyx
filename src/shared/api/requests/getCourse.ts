import db from '@/lib/supabase/client'

export const getCourse = async (courseUrl: string) => await db
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
.eq("url", courseUrl)
.single()
