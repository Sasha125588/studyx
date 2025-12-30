export const isDev = process.env.NODE_ENV === 'development'

export const APIUrl = isDev ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_API_RAILWAY_URL!
