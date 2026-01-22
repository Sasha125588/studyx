import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  ignores: ['./.source/*'],
  rules: {
    'n/prefer-global/process': ['off'],
  },
})
