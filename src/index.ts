import { resolve } from 'node:path';
import type { UnpluginFactory } from 'unplugin';
import { createUnplugin } from 'unplugin';
import { CheckSyntax } from './checkSyntax.js';
import { printErrors } from './printErrors.js';
import type { CheckSyntaxOptions } from './types.js';
import { checkIsExclude } from './utils.js';

const HTML_REGEX = /\.html$/;
const JS_REGEX: RegExp = /\.(?:js|mjs|cjs|jsx)$/;

export const unpluginFactory: UnpluginFactory<CheckSyntaxOptions | undefined> = (options = {}) => {
  const checker = new CheckSyntax({
    rootPath: process.cwd(),
    ...options,
  });

  return {
    name: 'unplugin-check-syntax',

    // For webpack and rspack
    webpack(compiler) {
      // Skip in development mode
      if (compiler.options.mode === 'development') {
        return;
      }

      compiler.hooks.afterEmit.tapPromise(
        'unplugin-check-syntax',
        async (compilation) => {
          const outputPath = compilation.outputOptions.path || 'dist';

          // Get all emitted assets
          const emittedAssets = Array.from(compilation.emittedAssets || [])
            .map((name) => {
              // remove query from name
              const resourcePath = name.split('?')[0];
              const file = resolve(outputPath, resourcePath);
              if (!checkIsExclude(file, checker.excludeOutput)) {
                return file;
              }
              return '';
            })
            .filter(Boolean);

          const files = emittedAssets.filter(
            (assets) => HTML_REGEX.test(assets) || JS_REGEX.test(assets),
          );

          await Promise.all(
            files.map(async (file) => {
              await checker.check(file);
            }),
          );

          printErrors(checker.errors, checker.ecmaVersion, checker.excludeErrorLogs);
        },
      );
    },

    // For Vite
    vite: {
      apply: 'build', // Only run in build mode
      writeBundle: {
        sequential: true,
        order: 'post',
        handler: async (options, bundle) => {
          const outputDir = options.dir || 'dist';

          const files = Object.keys(bundle)
            .map((fileName) => {
              const file = resolve(outputDir, fileName);
              if (!checkIsExclude(file, checker.excludeOutput)) {
                return file;
              }
              return '';
            })
            .filter(Boolean)
            .filter((file) => HTML_REGEX.test(file) || JS_REGEX.test(file));

          await Promise.all(
            files.map(async (file) => {
              await checker.check(file);
            }),
          );

          printErrors(checker.errors, checker.ecmaVersion, checker.excludeErrorLogs);
        },
      },
    },

    // For Rollup
    rollup: {
      writeBundle: {
        sequential: true,
        order: 'post',
        handler: async (options, bundle) => {
          const outputDir = options.dir || 'dist';

          const files = Object.keys(bundle)
            .map((fileName) => {
              const file = resolve(outputDir, fileName);
              if (!checkIsExclude(file, checker.excludeOutput)) {
                return file;
              }
              return '';
            })
            .filter(Boolean)
            .filter((file) => HTML_REGEX.test(file) || JS_REGEX.test(file));

          await Promise.all(
            files.map(async (file) => {
              await checker.check(file);
            }),
          );

          printErrors(checker.errors, checker.ecmaVersion, checker.excludeErrorLogs);
        },
      },
    },

    // For esbuild
    esbuild: {
      setup(build) {
        // Skip in development mode
        if (build.initialOptions.watch) {
          return;
        }

        build.onEnd(async (result) => {
          if (result.errors.length) {
            return;
          }

          const outputDir = build.initialOptions.outdir || 'dist';
          const outputFiles = result.outputFiles || [];

          const files = outputFiles
            .map((file) => {
              if (!checkIsExclude(file.path, checker.excludeOutput)) {
                return file.path;
              }
              return '';
            })
            .filter(Boolean)
            .filter((file) => HTML_REGEX.test(file) || JS_REGEX.test(file));

          await Promise.all(
            files.map(async (file) => {
              await checker.check(file);
            }),
          );

          printErrors(checker.errors, checker.ecmaVersion, checker.excludeErrorLogs);
        });
      },
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;

// Export types and utilities
export type { CheckSyntaxOptions, EcmaVersion } from './types.js';
export { CheckSyntax } from './checkSyntax.js';
