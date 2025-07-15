import type { CheckSyntaxOptions } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import vite from './vite'
import webpack from './webpack'

export interface ModuleOptions extends CheckSyntaxOptions {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'unplugin-check-syntax',
    configKey: 'checkSyntax',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
