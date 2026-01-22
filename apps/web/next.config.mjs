import { withMicrofrontends } from '@vercel/microfrontends/next/config'
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
  typedRoutes: true,
  transpilePackages: ['@studyx/ui'],
}

const withMDX = createMDX({
  configPath: './source.config.ts',
})

export default withMDX(withMicrofrontends(config, { debug: true }))
