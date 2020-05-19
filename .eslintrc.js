module.exports = {
  settings: {
    'import/resolver': {
      webpack: {
        config: 'scripts/webpack.config.base.js'
      }
    },
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint-config-ali',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true
  },
  parser: 'babel-eslint',
  plugins: ['react', 'babel', 'react-hooks'],
  rules: {
    'space-before-function-paren': 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': [
      'warn',
      { props: true, ignorePropertyModificationsFor: ['draft'] }
    ],
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'react/display-name': 'off',
    'prettier/prettier': 'warn',
    'space-before-function-paren': 'off'
  }
}
