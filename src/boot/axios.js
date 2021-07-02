import {boot} from 'quasar/wrappers'
import axios from 'axios'

export default boot(async ({app}) => {
  app.config.globalProperties.$axios = axios
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
  axios.defaults.withCredentials = true

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
