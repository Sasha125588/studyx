import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const config = {
	typedRoutes: true,
	transpilePackages: ['@studyx/ui']
}

const withMDX = createMDX({
	// customise the config file path
	configPath: './source.config.ts'
})

export default withMDX(config)
