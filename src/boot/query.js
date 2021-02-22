import QuerySupport from '@oarepo/vue-query-synchronizer'

export default ({ Vue, router }) => {
  Vue.use(QuerySupport, {
    router,
    debug: false
  })
}
