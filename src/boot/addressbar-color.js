import {AddressbarColor, getCssVar} from 'quasar'
import {boot} from 'quasar/wrappers'

export default boot(async ({app}) => {
  AddressbarColor.set(getCssVar('primary'))
})
