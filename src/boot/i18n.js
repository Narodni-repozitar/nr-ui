import {boot} from 'quasar/wrappers'
import {createI18n} from 'vue-i18n'
import MultilingualTranslated from 'src/i18n/multilingual_translation'
import messages from 'src/i18n'

const i18n = createI18n({
  locale: 'cs',
  messages
})

export default boot(({app}) => {
  // Set i18n instance on app
  app.use(i18n).use(MultilingualTranslated)
})

export {i18n}
