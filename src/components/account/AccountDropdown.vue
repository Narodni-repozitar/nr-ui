<template lang="pug">
  q-btn-dropdown.full-height(
    no-caps
    dense
    size="md"
    ripple
    unelevated
    icon="person"
    text-color="white"
    :label="currentUserName"
    v-if="authenticated")
    .bg-secondary
      .row.no-wrap.q-pa-md.justify-start
        .col-2
          q-icon.q-my-sm.text-h4.content-center.text-primary(name="how_to_reg")
        .col-8
          .text-h8.q-mx-md Role uživatele
            .text-grey
              span(v-for="(role, idx) in roles" :key="idx")
                span(v-if="idx>0") {{ ', ' }}
                span {{ role.label }}
      q-separator(inset)
      .row.no-wrap.q-pa-sm.justify-center
        q-btn(size="sm" icon="settings" flat label="Administrace" :to="{ name: 'admin-index'}")
        q-btn(size="sm" icon="input" flat label="Odhlásit se" @click="logout")
  q-btn(v-else size="md" flat icon="person" @click="login" label="Přihlásit se")
</template>

<script>
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { AuthMixin } from 'src/mixins/Auth'

export default @Component({
  name: 'AccountDropdown',
  props: {
    authenticated: {
      type: Boolean,
      default: false
    }
  }
})
class AccountDropdown extends mixins(AuthMixin) {
  login () {
    this.$auth.login()
  }

  logout () {
    this.$auth.logout()
  }
}
</script>

<style lang="sass" scoped>
</style>
