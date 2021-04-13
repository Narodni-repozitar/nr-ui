import {boot} from 'quasar/wrappers'
import MultilingualText from 'src/components/i18n/MultilingualText'

export default boot(({app}) => {
  app.component('mt', MultilingualText)
})
