import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export const nextConfig = defineConfig([
	...nextVitals,
	...nextTs,
	prettier,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
	{
		rules: {
			'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration'],
			'prefer-arrow-callback': 'error',
			'func-style': ['error', 'expression']
		}
	},
	{
		files: ['src/components/animate-ui/**/*', 'src/components/ui/**/*', 'src/lib/**/*'],
		rules: {
			'prefer-arrow-callback': 'off',
			'func-style': 'off',
			'no-restricted-syntax': 'off',
			'react-hooks/preserve-manual-memoization': 'off',
			'react-hooks/refs': 'off'
		}
	},
	{
		ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
	}
])

export default nextConfig
