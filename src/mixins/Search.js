import { Component, Emit, Vue } from 'vue-property-decorator'

@Component
class EmitSearchMixin extends Vue {
  @Emit('search')
  doSearch (query) {
    return query
  }
}

export { EmitSearchMixin }
