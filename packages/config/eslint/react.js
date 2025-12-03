import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export const reactConfig = defineConfig([
	prettier,
	globalIgnores(['node_modules/**', 'dist/**', '.turbo/**', 'build/**']),
	{
		rules: {
			'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration'],
			'prefer-arrow-callback': 'error',
			'func-style': ['error', 'expression']
		}
	},
	{
		files: ['src/components/**/*', 'src/lib/**/*'],
		rules: {
			'prefer-arrow-callback': 'off',
			'func-style': 'off',
			'no-restricted-syntax': 'off'
		}
	}
])

export default reactConfig
