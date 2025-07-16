import type { CheckSyntaxOptions } from './types'
import { PLUGIN_NAME } from './utils.js';
import unplugin from '.'

export default (options: CheckSyntaxOptions): any => ({
  name: PLUGIN_NAME,
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
