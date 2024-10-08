import { createResolver } from '@nuxt/kit'
import { tailwindcss, security } from './config'

const { resolve } = createResolver(import.meta.url)
export default defineNuxtConfig({
  devtools: { enabled: false },

  nitro: {
    preset: process.env.NITRO_PRESET,
  },

  app: {
    head: {
      title: 'Nuxt starter',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'Edge compatible Nuxt starter' },
        { name: 'theme-color', content: '#18181B' },
      ],
    },
  },

  css: ['~/assets/styles/main.css'],
  runtimeConfig: {
    NUXT_AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    public: {
      APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,
      NUXT_AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  alias: {
    '@': resolve('./'),
    '~': resolve('./'),
  },
  build: { transpile: ['trpc-nuxt'] },
  icon: {
    customCollections: [
      {
        prefix: 'local-auth',
        dir: './assets/icons/auth',
      },
    ],
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui',
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
  imports: {
    autoImport: true,
    dirs: [resolve('./stores'), '~/stores'],
  },

  // module::pinia
  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },
  tailwindcss,
  security,

  colorMode: {
    classSuffix: '',
    classPrefix: '',
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        module: 'ESNext',
      },
    },
  },

  compatibilityDate: '2024-09-10',
})
