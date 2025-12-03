import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export const baseConfig = defineConfig([
	prettier,
	globalIgnores(['node_modules/**', 'dist/**', '.turbo/**', 'build/**']),
	{
		rules: {
			'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration'],
			'prefer-arrow-callback': 'error',
			'func-style': ['error', 'expression']
		}
	}
])

export default baseConfig
