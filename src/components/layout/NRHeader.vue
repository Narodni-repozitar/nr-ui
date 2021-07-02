<template lang="pug">
q-header.bordered-header.bg-color
  q-toolbar.row.justify-between
    .col-lg-2.col-md-1.col-xs-0
    router-link.col-auto(to="/")
      img(src='../../assets/logo_nr.png').nr-logo
    .col-grow
    locale-switcher.push-right.col-auto.q-mr-sm(hide-hint)
    account-dropdown.float-right.col-auto(dark :authenticated="authenticated")
    .col-lg-2.col-md-1.col-xs-0
</template>
<script>
import {defineComponent} from 'vue'
import useAuth from 'src/composables/useAuth'
import AccountDropdown from 'components/account/AccountDropdown'
import LocaleSwitcher from 'components/i18n/LocaleSwitcher'

export default defineComponent({
  name: 'NRHeader',
  components: {LocaleSwitcher, AccountDropdown},
  setup () {
    const { authenticated } = useAuth()

    return { authenticated }
  }
})
</script>

<style scoped lang="sass">
h4
  font-size: 14px
.bordered-header
  border-bottom: 1px solid #E6E6E6
  margin-bottom: 5px
.bg-color
  background-color: white
.nr-logo
  max-width: 140px
</style>
