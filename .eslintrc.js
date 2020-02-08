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
    // 'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    // 'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    // 'import/no-extraneous-dependencies': 'off',
    // 'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'react/display-name': 'off',
    // 'react/forbid-prop-types': 'off',
    // 'react/jsx-indent': ['error', 2],
    // 'react/jsx-indent-props': ['error', 2],
    // 'react/jsx-wrap-multilines': [
    //   'error',
    //   { declaration: false, assignment: false },
    // ],
    // // "function-paren-newline": ["error", { "minItems": 2 }],
    // "object-property-newline": ["error"],
    // 'react/jsx-closing-bracket-location': [1],
    // 'max-len': [0, 80, 2],
    // 'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // 'prefer-destructuring': 'off', // airbnb is using error. destructuring harm grep potential.
    // 'no-alert': 'error', // airbnb is using warn
    // 'no-prototype-builtins': 'off', // airbnb use error
    // 'operator-linebreak': 'error', // airbnb use error
    // 'no-return-assign': 'off', // aribnb use warn
    // 'no-param-reassign': 'off', // airbnb use error
    // 'react/jsx-no-bind': 'off',
    // 'react/destructuring-assignment': [1],
    // 'react/no-find-dom-node': 'off', // airbnb use error
    // 'react/sort-prop-types': 'error', // airbnb use off
    // 'react/destructuring-assignment': 'off',
    // 'react/default-props-match-prop-types': 'warn',
    // 'react/require-default-props': 'off',
    // 'react/no-array-index-key': 'warn',
    'prettier/prettier': 'warn',
    'space-before-function-paren': 'off'
    // 'react/jsx-filename-extension': [
    //   'warn',
    //   { extensions: ['.js', '.jsx', '.md'] },
    // ],
    // 'jsx-a11y/no-static-element-interactions': 'off',
    // 'jsx-a11y/anchor-has-content': 'off',
    // 'jsx-a11y/click-events-have-key-events': 'off',
    // 'jsx-a11y/anchor-is-valid': 'off',
    // 'jsx-a11y/label-has-for': 'off',
    // 'jsx-a11y/label-has-associated-control': 'off',
    // 'no-underscore-dangle': 'off',
    // indent: ['error', 2, { SwitchCase: 1 }], //规定代码的缩进方式：2个空格
    // camelcase: 'error', //强制驼峰法命名
    // eqeqeq: 'error', //必须使用全等
    // 'brace-style': ['error', '1tbs'], // 大括号风格
    // quotes: ['error', 'single'], // 引号类型
    // semi: ['error', 'never'], // 语句强制分号结尾
    // 'comma-dangle': ['error', 'never'],
    // 'linebreak-style': ['error', 'unix'],
    // 'space-infix-ops': 'error', // 中缀操作符周围要不要有空格
    // 'prefer-spread': 'error', // 首选展开运算
    // 'no-unused-expressions': ['error', { allowShortCircuit: true }],
    // 'no-multi-spaces': 'error',
    // 'object-curly-newline': 'off',
    // 'jsx-a11y/no-noninteractive-element-interactions': [1],
  }
}
