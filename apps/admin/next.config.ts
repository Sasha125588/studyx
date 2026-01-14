import { withMicrofrontends } from '@vercel/microfrontends/next/config'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	basePath: '/admin'
}

export default withMicrofrontends(nextConfig, { debug: true })
