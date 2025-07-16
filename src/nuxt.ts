import type { CheckSyntaxOptions } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import vite from './vite'
import webpack from './webpack'
import { PLUGIN_NAME } from './utils.js';

export interface ModuleOptions extends CheckSyntaxOptions {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: PLUGIN_NAME,
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
