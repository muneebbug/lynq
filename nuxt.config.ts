import { createResolver } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import { security } from './config'

const { resolve } = createResolver(import.meta.url)
export default defineNuxtConfig({

  modules: [
    'nuxt-security',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  imports: {
    autoImport: true,
    dirs: [resolve('./stores'), '~/stores'],
  }, devtools: { enabled: false },

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

  css: ['~/assets/styles/main.css', '~/assets/css/tailwind.css'],

  colorMode: {
    classSuffix: '',
    classPrefix: '',
  },
  runtimeConfig: {
    NUXT_AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    public: {
      APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,
      NUXT_AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    },
  },
  alias: {
    '@': resolve('./'),
    '~': resolve('./'),
  },
  build: { transpile: ['trpc-nuxt'] },

  compatibilityDate: '2024-09-10',

  nitro: {
    preset: process.env.NITRO_PRESET,
    routeRules: {
      // Disable caching for all routes
      '/**': {
        cache: false,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        module: 'ESNext',
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
  icon: {
    customCollections: [
      {
        prefix: 'local-auth',
        dir: './assets/icons/auth',
      },
    ],
  },

  // module::pinia
  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },
  security,
  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui',
  },
})
