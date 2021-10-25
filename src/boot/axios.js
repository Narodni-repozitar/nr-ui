import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {Dialog, useQuasar} from "quasar";
import {usePopupLogin} from "@oarepo/vue-popup-login";
import {loginOptions} from "src/constants";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {i18n} from "boot/i18n";
import AuthRequiredDialog from "components/dialogs/AuthRequiredDialog";
const {login} = usePopupLogin(loginOptions)

export default boot(async ({app}) => {
  app.config.globalProperties.$axios = axios
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  axios.defaults.withCredentials = true

  // Function that will be called to refresh authorization
  const refreshAuthLogic = failedRequest => {
    const showPopupLogin = async () => {
      const loginOutcome = await login()
      console.log(loginOutcome)
    }

    const dialog = Dialog.create({
      component: AuthRequiredDialog,
      persistent: true,
    }).onOk(() => {
      console.log('OK')
      return Promise.resolve()
    }).onCancel(() => {
      console.log('Cancel')
      return Promise.reject()
    })
  }

  // Instantiate the interceptor
  createAuthRefreshInterceptor(axios, refreshAuthLogic, {pauseInstanceWhileRefreshing: true})

  // axios.interceptors.response.use(function (response) {
  //   return response
  // }, function (error) {
  //   console.log(error.response.data)
  //   if (error.response.status === 401) {
  //     return new Promise((resolve) => {
  //       BottomSheet.create({
  //         persistent: true,
  //         message: 'Authentication required. Click on the button below to log in.',
  //         actions: [{
  //           label: 'Log in',
  //           icon: 'vpn_key',
  //           id: 'log in'
  //         }]
  //       }).onOk(() => {
  //         resolve(login())
  //       })
  //     })
  //   }
  //   return Promise.reject(error)
  // })

  axios.defaults.headers.common = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Forwarded-Proto': 'https',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
})

export {axios}
