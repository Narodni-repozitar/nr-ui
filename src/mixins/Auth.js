import { Component, Vue } from 'vue-property-decorator'

@Component({})
class AuthMixin extends Vue {
  get authState () {
    return this.$auth.state.value
  }

  get isCurator () {
    return this.roles.some(x => x.id === 'curator')
  }

  get roles () {
    const authState = this.authState
    return authState?.user?.roles || []
  }

  get currentUserName () {
    const authState = this.authState
    return authState?.userInfo?.givenName || authState.user?.email
  }
}

export { AuthMixin }
