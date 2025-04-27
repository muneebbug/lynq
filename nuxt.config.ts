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
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Lynq - URL Shortener',
      titleTemplate: '%s | Lynq',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'Lynq - A modern URL shortener with powerful analytics and customization features' },
        { name: 'theme-color', content: '#18181B' },
        { name: 'msapplication-TileColor', content: '#18181B' },
        { name: 'msapplication-TileImage', content: '/images/favicons/ms-icon-144x144.png' },
        { name: 'msapplication-config', content: '/images/favicons/browserconfig.xml' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: 'Lynq' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/images/og-image.png' },
        { property: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicons/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/images/favicons/apple-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/images/favicons/apple-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/images/favicons/apple-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/images/favicons/apple-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/images/favicons/apple-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/images/favicons/apple-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/images/favicons/apple-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/images/favicons/apple-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicons/apple-icon-180x180.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/favicons/android-icon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/images/favicons/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicons/favicon-16x16.png' },
        { rel: 'manifest', href: '/images/favicons/manifest.json' },
      ],
    },
  },

  css: ['~/assets/css/tailwind.css'],

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
