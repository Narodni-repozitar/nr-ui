import VueQuerySynchronizer from "@oarepo/vue-query-synchronizer";
import InvenioApi from '@oarepo/invenio-vue'
import QuasarESFacets from '@oarepo/quasar-es-facets'


export default ({app, router}) => {
  app
    .use(VueQuerySynchronizer, {
      router,
      debug: true
    })
    .use(InvenioApi)
    .use(QuasarESFacets)
}
