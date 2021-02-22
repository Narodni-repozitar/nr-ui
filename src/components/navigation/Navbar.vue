<template lang="pug">
q-header.row.bg-accent.q-pt-sm(:class="[mode === modes.INTRO? 'lightened': '']")
  q-toolbar.offset-1.col-grow.no-padding
    q-btn(
      v-if="mode !== modes.INTRO"
      flat
      rounded
      dense
      v-go-back.single
      color="white"
      icon="arrow_back"
    )
    q-toolbar-title.text-uppercase.text-weight-bold
      router-link(to="/objekty/" style="text-decoration: none; color: white !important") {{ productName }}
    q-space
    q-btn-group(v-if="authenticated && mode === modes.INTRO" flat)
      q-btn(flat :label="$t('nav.admin')" :to="{ name: 'admin-index' }" icon="settings")
    account-dropdown(:authenticated="authenticated")
    q-btn.q-ml-md(
      v-if="mode === modes.LIST"
      flat
      @click="facets"
      round
      dense
      icon="menu")
  .col-1
</template>

<script>
import { Component, Emit, Vue } from 'vue-property-decorator'
import AccountDropdown from 'src/components/account/AccountDropdown'

export const Modes = Object.freeze({
  INTRO: 'intro',
  LIST: 'list',
  DETAIL: 'detail',
  ADMIN: 'admin'
})

export default @Component({
  name: 'Navbar',
  props: {
    mode: {
      type: String,
      default: Modes.INTRO,
      validator: mode => Object.values(Modes).indexOf(mode) > -1
    }
  },
  components: {
    AccountDropdown
  }
})
class Navbar extends Vue {
  get modes () {
    return Modes
  }

  get authenticated () {
    return this.$auth.state.value.loggedIn
  }

  get productName () {
    return this.$i18n.t('app.productName')
  }

  @Emit('facets')
  facets () { }
}
</script>

<style lang="sass" scoped>
.lightened
  filter: opacity(0.5)
</style>
