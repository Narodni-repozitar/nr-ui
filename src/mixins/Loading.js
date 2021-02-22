import { Component, Vue } from 'vue-property-decorator'

@Component
class LoadingMixin extends Vue {
  isLoading = false

  startLoading () {
    this.isLoading = true
  }

  loaded () {
    this.isLoading = false
  }
}

export { LoadingMixin }
