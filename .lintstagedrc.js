module.exports = {
	// Lint & type-check TypeScript and JavaScript files
	'**/*.(ts|tsx|js|jsx)': filenames => [
		`bunx eslint --fix ${filenames.map(f => `"${f}"`).join(' ')}`,
		`bunx tsc --noEmit`
	],

	// Format all files with Prettier
	'**/*.(ts|tsx|js|jsx|json|css|md)': filenames =>
		`bunx prettier --write ${filenames.map(f => `"${f}"`).join(' ')}`
}
