import {boot} from 'quasar/wrappers'
import axios from 'axios'

export default boot(({app}) => {
  app.config.globalProperties.$axios = axios
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
  axios.defaults.headers.common = {
    'X-Forwarded-Proto': 'https',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Authorization': 'Bearer DYfJ2TM4rO26luBwODkFg44XJoFa9T3dPVqL3twi5BJ07t29c3XkkUqYS44y'
  };
})

export {axios}
