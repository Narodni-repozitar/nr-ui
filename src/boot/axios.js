import {boot} from 'quasar/wrappers'
import axios from 'axios'

export default boot(async ({app}) => {
  app.config.globalProperties.$axios = axios
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

  const token = (await axios.get('/__token.json')).data

  axios.defaults.headers.common = {
    'X-Forwarded-Proto': 'https',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Authorization': `Bearer ${token.token}`
  };
})

export {axios}
