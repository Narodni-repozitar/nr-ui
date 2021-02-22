import PopupLogin from '@oarepo/vue-popup-login'

export default ({
  Vue,
  router
}) => {
  Vue.use(PopupLogin, {
    router,

    // urls
    loginUrl: '/api/oauth/login/cis/',
    logoutUrl: '/api/logout',
    logoutMethod: 'POST',
    completeUrl: '/api/oauth/complete/',
    stateUrl: '/api/oauth/state'
  })
}
