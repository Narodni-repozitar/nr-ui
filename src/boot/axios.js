import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {Dialog, useQuasar} from "quasar";
import {usePopupLogin} from "@oarepo/vue-popup-login";
import {loginOptions} from "src/constants";
import {i18n} from "boot/i18n";
import AuthRequiredDialog from "components/dialogs/AuthRequiredDialog";
const {login} = usePopupLogin(loginOptions)

export default boot(async ({app}) => {
  app.config.globalProperties.$axios = axios
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  axios.defaults.withCredentials = true

  // Function that will be called to refresh authorization
  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    if (error.response.status === 401) {
      if (error.config.retry401) { return Promise.reject(error) }
      return new Promise((resolve, reject) => {
        Dialog.create({
          component: AuthRequiredDialog,
          persistent: true,
        }).onOk((loginOutcome) => {
          if (loginOutcome) {
            error.config.retry401 = true
            axios.request(error.config).then((r) => {
              resolve(r)
            }).catch(err => {
              reject(err)
            })
          }
          reject()
        }).onCancel(() => {
          reject()
        })
      })
    }
    return Promise.reject(error)
  })

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
