<template lang="pug">
q-header.bordered-header.bg-color
  q-toolbar.nr-header.row.justify-between.items-center
    .col-lg-2.col-md-1.col-xs-0
    router-link.col-auto(to="/")
      product-logo(dense v-if="route.path !== '/'")
    .col-grow
    .row.col-auto.q-gutter-md
      create-record-btn(v-if="authenticated && currentUserCommunities.length && route.meta.showCreateRecord")
      locale-switcher.self-center.push-right.col-auto.q-mr-sm(hide-hint)
      account-dropdown.float-right.col-auto(dark :authenticated="authenticated")
    .col-lg-2.col-md-1.col-xs-0
  community-select.absolute-bottom.absolute-center(v-if="authenticated && route.meta.communitySelect")
</template>
<script>
import {defineComponent} from 'vue'
import {useRoute} from 'vue-router'
import useAuth from 'src/composables/useAuth'
import AccountDropdown from 'components/account/AccountDropdown'
import LocaleSwitcher from 'components/i18n/LocaleSwitcher'
import ProductLogo from 'components/ui/ProductLogo'
import CreateRecordBtn from 'components/controls/buttons/CreateRecordBtn'
import CommunitySelect from 'components/controls/selects/CommunitySelect'

export default defineComponent({
  name: 'NRHeader',
  components: {CommunitySelect, ProductLogo, LocaleSwitcher, AccountDropdown, CreateRecordBtn},
  setup () {
    const { authenticated, currentUserCommunities, effectiveCommunity } = useAuth()
    const route = useRoute()

    return { authenticated, currentUserCommunities, effectiveCommunity, route }
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
