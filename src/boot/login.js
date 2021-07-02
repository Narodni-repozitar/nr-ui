import {boot} from 'quasar/wrappers'
import PopupLogin, {usePopupLogin} from '@oarepo/vue-popup-login'
import {loginOptions} from 'src/constants'


export default boot(async ({app, router}) => {
  const auth = usePopupLogin(loginOptions)

  app.use(PopupLogin, {
    router,
    ...loginOptions
  })

  router.isReady().then(() => auth.check())

  return auth
})
