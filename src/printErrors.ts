import color from 'picocolors';
import type { ECMASyntaxError, EcmaVersion, SyntaxErrorKey } from './types.js';
import { PLUGIN_NAME } from './utils.js';

export function printErrors(
  errors: ECMASyntaxError[],
  ecmaVersion: EcmaVersion,
  excludeErrorLogs: SyntaxErrorKey[],
) {
  if (!errors.length) {
    return;
  }

  console.error(
    color.red(
      `\n[${PLUGIN_NAME}] Find ${errors.length} file(s) with syntax errors that incompatible with "ES${ecmaVersion}":`,
    ),
  );

  for (const error of errors) {
    const errorInfo = {
      source: error.source.path,
      output: error.output?.path,
      reason: error.message,
      code: error.source.code,
    };

    console.error(color.yellow(`\n• ${errorInfo.source}:${error.source.line}:${error.source.column}`));

    if (error.output && !excludeErrorLogs.includes('output')) {
      console.error(color.gray(`  Output: ${errorInfo.output}:${error.output.line}:${error.output.column}`));
    }

    if (!excludeErrorLogs.includes('reason')) {
      console.error(color.red(`  Reason: ${errorInfo.reason}`));
    }

    if (!excludeErrorLogs.includes('code')) {
      console.error(color.gray(`  Code: ${errorInfo.code}`));
    }
  }

  console.error(
    color.yellow(
      `\n[${PLUGIN_NAME}] Please check the above files, or you can adjust the browserslist to match the syntax.`,
    ),
  );
}
