import type { Database } from "./database.types";

export type Course = Database['public']['Tables']["course"]['Row']
export type Module = Database['public']['Tables']["module"]['Row']
export type Lecture = Database['public']['Tables']['lectures']['Row']
export type Practical = Database['public']['Tables']["practical"]['Row']