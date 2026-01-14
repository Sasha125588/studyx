import { nextConfig } from './packages/config/eslint/next.js'

export default [
	...nextConfig.map(config => ({
		...config,
		files: config.files ? config.files.map(f => `apps/web/${f}`) : ['apps/web/**/*.{js,jsx,ts,tsx}']
	})),
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.next/**',
			'**/out/**',
			'**/build/**',
			'**/.turbo/**',
			'**/next-env.d.ts',
			'**/generated/**',
			'apps/web/src/shared/api/elysia/**',
			'**/apps/web/.source/**'
		]
	}
]
