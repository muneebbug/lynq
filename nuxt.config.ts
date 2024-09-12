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

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
  ],

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

  devServer: {
    port: 3000,
    host: '127.0.0.1',
  },

  compatibilityDate: '2024-09-10',
})
