import VueQrcode from '@chenfengyuan/vue-qrcode'

export default defineNuxtPlugin((nuxtApp) => {
  if (VueQrcode.name) {
    nuxtApp.vueApp.component(VueQrcode.name, VueQrcode)
  }
})
