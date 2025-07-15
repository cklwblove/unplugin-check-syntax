import type { CheckSyntaxOptions } from './types'

import unplugin from '.'

export default (options: CheckSyntaxOptions): any => ({
  name: 'unplugin-check-syntax',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
