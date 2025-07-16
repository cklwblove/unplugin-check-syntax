import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import UnpluginCheckSyntax from '@winner-fed/unplugin-check-syntax/rspack';

export default defineConfig({
  source: {
    entry: {
      index: path.resolve(__dirname, './main.ts')
    },
  },
  output: {
    sourceMap: {
      js: 'source-map',
    },
    // overrideBrowserslist: ['ie 11'],
  },
  tools: {
    rspack: {
      plugins: [
        UnpluginCheckSyntax({
          ecmaVersion: 2015,
        }),
      ],
    },
  }
});
