import {boot} from 'quasar/wrappers'
import MultilingualText from 'src/components/i18n/MultilingualText'
import SimpleTerm from 'src/components/taxonomy/SimpleTerm'
import CancelButton from 'src/components/controls/CancelButton'

export default boot(({app}) => {
  app.component('mt', MultilingualText)
  app.component('simple-term', SimpleTerm)
  app.component('cancel-button', CancelButton)
})
