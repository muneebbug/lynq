import { tailwindcss, security } from './config'

export default defineNuxtConfig({
  ssr: true,
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
  ],
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
