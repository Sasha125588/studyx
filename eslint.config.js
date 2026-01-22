// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    overrides: {
      'style/dot-location': ['error', 'property'],
      'style/max-len': ['error', {
        code: 100,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreComments: true,
      }],
      'style/no-tabs': ['off', { allowIndentationTabs: true }],
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
  typescript: true,
  rules: {
    'n/prefer-global/process': ['off'],
  },
})
