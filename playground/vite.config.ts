import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import CheckSyntax from '../src/vite';

export default defineConfig({
  plugins: [
    Inspect(),
    CheckSyntax({
      // 设置目标为较老的浏览器，这样新语法会被检测出来
      // targets: ['ie 11', 'chrome 60'],
      // 或者直接指定 ECMAScript 版本
      ecmaVersion: 2015,
      // 测试 include 功能，手动包含额外的文件
      include: [
        'test-include.js',  // 包含测试文件
        '*.html'            // 包含 HTML 文件
      ]
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
