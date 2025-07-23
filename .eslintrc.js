// ESLint 配置文件，使用 TypeScript 解析器
module.exports = {
  // 指定解析器为 @typescript-eslint/parser
  parser: '@typescript-eslint/parser',
  // 继承推荐的 ESLint 规则和 TypeScript 规则
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  // 启用 @typescript-eslint 插件
  plugins: ['@typescript-eslint'],
  // 指定代码运行环境为 Node.js 和 ES2022
  env: {
    node: true,
    es2022: true,
  },
  // 解析器选项，指定 ECMAScript 版本和模块类型
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  // 自定义规则
  rules: {
    // 禁止未使用的变量
    '@typescript-eslint/no-unused-vars': 'error',
    // 使用 any 类型时警告
    '@typescript-eslint/no-explicit-any': 'warn',
    // 关闭强制显式函数返回类型
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 关闭强制显式模块边界类型
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 关闭禁止可推断类型
    '@typescript-eslint/no-inferrable-types': 'off',
    // 必须使用 const 替代 let/var（如果变量不会被重新赋值）
    'prefer-const': 'error',
    // 禁止使用 var
    'no-var': 'error',
  },
  // 忽略的文件和文件夹
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
  ],
};
