// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  css: [
    '@/assets/css/global.scss'
  ],

  modules: ['@vueuse/motion/nuxt'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  }
})