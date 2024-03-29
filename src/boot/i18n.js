import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import cs from '../locales/cs-cz.json'
import en from '../locales/en-us.json'
import MultilingualTranslated from 'src/i18n/multilingual_translation'
import {boot} from 'quasar/wrappers'


const defaultLocale = 'cs-cz'
let browserLocale = Quasar.lang.getLocale()

if (browserLocale === 'cs') {
  browserLocale = 'cs-cz'
} if (browserLocale === 'en') {
  browserLocale = 'en-us'
}

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const messages = {
    cs: cs,
    'cs-cz': cs,
    en: en,
    'en-us': en
  }
  return messages
}

const i18n =  createI18n({
  legacy: false,
  globalInjection: true,
  locale: browserLocale,
  fallbackLocale: defaultLocale,
  messages:  loadLocaleMessages()
})

export default boot(({app}) => {
  // Set i18n instance on app
  app.use(i18n).use(MultilingualTranslated)
})

export {i18n}
