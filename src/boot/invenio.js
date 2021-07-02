import VueQuerySynchronizer from "@oarepo/vue-query-synchronizer";
import InvenioApi from '@oarepo/invenio-vue'
import QuasarESFacets from '@oarepo/quasar-es-facets'
import {boot} from 'quasar/wrappers'


export default boot(({app, router}) => {
  app
    .use(VueQuerySynchronizer, {
      router,
      debug: false
    })
    .use(InvenioApi)
    .use(QuasarESFacets)
})
