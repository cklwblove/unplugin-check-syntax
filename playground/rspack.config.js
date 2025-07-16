import { defineConfig } from '@rspack/cli';
import UnpluginCheckSyntax from '@winner-fed/unplugin-check-syntax/rspack';

export default defineConfig({
  entry: {
    main: './main.ts',
    test: './rspack-test.ts',
  },
  mode: 'production',
  output: {
    path: './dist',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    UnpluginCheckSyntax({
      ecmaVersion: 2015, // 检查ES2015兼容性
      excludeErrorLogs: [], // 不排除任何错误日志
    }),
  ],
}); 