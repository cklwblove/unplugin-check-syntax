import fs from 'node:fs';
import { Parser } from 'htmlparser2';

export async function generateHtmlScripts(filepath: string): Promise<string[]> {
  const html = await fs.promises.readFile(filepath, 'utf-8');
  return getHtmlScripts(html);
}

export function getHtmlScripts(html: string): string[] {
  const inlineScripts: string[] = [];
  let currentScript: string | null = null;

  const parser = new Parser({
    onopentag(name, attrs) {
      if (
        name === 'script' &&
        !attrs.src &&
        (!attrs.type ||
          attrs.type === 'application/javascript' ||
          attrs.type === 'text/javascript')
      ) {
        currentScript = '';
      }
    },

    ontext(text) {
      if (currentScript !== null) {
        currentScript += text;
      }
    },

    onclosetag(tagname) {
      if (tagname === 'script' && currentScript) {
        inlineScripts.push(currentScript.trim());
      }
      currentScript = null;
    },
  });

  parser.write(html);
  parser.end();

  return inlineScripts;
} 