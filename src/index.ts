import { resolve } from 'node:path';
import type { UnpluginFactory } from 'unplugin';
import { createUnplugin } from 'unplugin';
import { CheckSyntax } from './checkSyntax.js';
import { printErrors } from './printErrors.js';
import type { CheckSyntaxOptions } from './types.js';
import { checkIsExclude, PLUGIN_NAME } from './utils.js';

const HTML_REGEX = /\.html$/;
const JS_REGEX: RegExp = /\.(?:js|mjs|cjs|jsx)$/;

export const unpluginFactory: UnpluginFactory<
  CheckSyntaxOptions | undefined
> = (options = {}) => {
  // 提供默认的ecmaVersion以确保类型兼容
  const checkerOptions = {
    rootPath: process.cwd(),
    ecmaVersion: 2015 as const, // 默认ES2015
    ...options
  };

  const checker = new CheckSyntax(checkerOptions);

  return {
    name: PLUGIN_NAME,

    // For webpack
    webpack(compiler) {
      // Skip in development mode
      if (compiler.options.mode === 'development') {
        return;
      }

      compiler.hooks.afterEmit.tapPromise(
        PLUGIN_NAME,
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
            (assets) => HTML_REGEX.test(assets) || JS_REGEX.test(assets)
          );

          // Add include files
          const includeFiles = await checker.getIncludeFiles();
          files.push(...includeFiles);

          // Remove duplicates
          const uniqueFiles = Array.from(new Set(files));

          await Promise.all(
            uniqueFiles.map(async (file) => {
              await checker.check(file);
            })
          );

          printErrors(
            checker.errors,
            checker.ecmaVersion,
            checker.excludeErrorLogs
          );
        }
      );
    },

    // For rspack
    rspack(compiler: any) {
      // Skip in development mode
      if (compiler.options.mode === 'development') {
        return;
      }

      compiler.hooks.afterEmit.tapPromise(
        PLUGIN_NAME,
        async (compilation: any) => {
          const outputPath = compilation.outputOptions.path || 'dist';

          // not support compilation.emittedAssets in Rspack
          // TODO 这里验证发现 rspack 的 compilation.getAssets() 是不包含子目录的和html文件的
          const emittedAssets = Array.from(
            compilation.getAssets().filter((a: any) => a.source) || []
          )
            .map((a: any) => {
              const nameStr = String(a.name);
              // remove query from name
              const resourcePath = nameStr.split('?')[0];
              const file = resolve(outputPath, resourcePath);
              if (!checkIsExclude(file, checker.excludeOutput)) {
                return file;
              }
              return '';
            })
            .filter(Boolean);

          const files = emittedAssets.filter(
            (assets) => HTML_REGEX.test(assets) || JS_REGEX.test(assets)
          );

          // Add include files
          const includeFiles = await checker.getIncludeFiles();
          files.push(...includeFiles);

          // Remove duplicates
          const uniqueFiles = Array.from(new Set(files));

          await Promise.all(
            uniqueFiles.map(async (file) => {
              await checker.check(file);
            })
          );

          printErrors(
            checker.errors,
            checker.ecmaVersion,
            checker.excludeErrorLogs
          );
          // try {
          //   // For rspack, use file system scanning to get complete output files
          //   // as compilation.assets and getAllAssets() may not capture all files including subdirectories
          //   const fs = await import('node:fs');
          //   const path = await import('node:path');
          //
          //   const scanDirectory = (dir: string): string[] => {
          //     const files: string[] = [];
          //     try {
          //       const entries = fs.readdirSync(dir, { withFileTypes: true });
          //
          //       for (const entry of entries) {
          //         const fullPath = path.join(dir, entry.name);
          //
          //         if (entry.isDirectory()) {
          //           // Recursively scan subdirectories
          //           files.push(...scanDirectory(fullPath));
          //         } else if (entry.isFile()) {
          //           files.push(fullPath);
          //         }
          //       }
          //     } catch (error) {
          //       console.warn(`[${PLUGIN_NAME}] Could not scan directory ${dir}:`, error);
          //     }
          //
          //     return files;
          //   };
          //
          //   // Get all files from output directory
          //   const allFiles = scanDirectory(outputPath);
          //
          //   // Filter files that are not excluded
          //   const emittedAssets = allFiles.filter(file =>
          //     !checkIsExclude(file, checker.excludeOutput)
          //   );
          //
          //   // Filter to only HTML and JS files
          //   const files = emittedAssets.filter(
          //     (file) => HTML_REGEX.test(file) || JS_REGEX.test(file)
          //   );
          //
          //   if (files.length === 0) {
          //     console.warn('[' + PLUGIN_NAME + '] No HTML or JS files found in rspack output');
          //     return;
          //   }
          //
          //   await Promise.all(
          //     files.map(async (file) => {
          //       await checker.check(file);
          //     })
          //   );
          //
          //   printErrors(
          //     checker.errors,
          //     checker.ecmaVersion,
          //     checker.excludeErrorLogs
          //   );
          // } catch (error) {
          //   console.error('[' + PLUGIN_NAME + '] Error during rspack file processing:', error);
          // }
        }
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

          // Add include files
          const includeFiles = await checker.getIncludeFiles();
          files.push(...includeFiles);

          // Remove duplicates
          const uniqueFiles = Array.from(new Set(files));

          await Promise.all(
            uniqueFiles.map(async (file) => {
              await checker.check(file);
            })
          );

          printErrors(
            checker.errors,
            checker.ecmaVersion,
            checker.excludeErrorLogs
          );
        }
      }
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

          // Add include files
          const includeFiles = await checker.getIncludeFiles();
          files.push(...includeFiles);

          // Remove duplicates
          const uniqueFiles = Array.from(new Set(files));

          await Promise.all(
            uniqueFiles.map(async (file) => {
              await checker.check(file);
            })
          );

          printErrors(
            checker.errors,
            checker.ecmaVersion,
            checker.excludeErrorLogs
          );
        }
      }
    },

    // For esbuild
    esbuild: {
      setup(build) {
        // Skip in development mode - check for watch mode properly
        const isWatchMode =
          (build.initialOptions as any).watch !== undefined &&
          (build.initialOptions as any).watch !== false;
        if (isWatchMode) {
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

          // Add include files
          const includeFiles = await checker.getIncludeFiles();
          files.push(...includeFiles);

          // Remove duplicates
          const uniqueFiles = Array.from(new Set(files));

          await Promise.all(
            uniqueFiles.map(async (file) => {
              await checker.check(file);
            })
          );

          printErrors(
            checker.errors,
            checker.ecmaVersion,
            checker.excludeErrorLogs
          );
        });
      }
    }
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;

// Export types and utilities
export type { CheckSyntaxOptions, EcmaVersion, ECMASyntaxError, SyntaxErrorKey } from './types.js';
export { CheckSyntax } from './checkSyntax.js';
export { printErrors } from './printErrors.js';
