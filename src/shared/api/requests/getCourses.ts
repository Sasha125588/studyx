import db from '@/lib/supabase/client'

export const getCourses = async () => await db.from('course').select("*")
