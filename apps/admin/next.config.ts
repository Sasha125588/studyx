import type { NextConfig } from 'next'
import { withMicrofrontends } from '@vercel/microfrontends/next/config'

const nextConfig: NextConfig = {
  basePath: '/admin',
}

export default withMicrofrontends(nextConfig, { debug: true })
