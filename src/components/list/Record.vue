<template lang="pug">
q-item.record.q-py-lg
  q-item-section(avatar)
    access-icon.block(:accessRights="m.accessRights" size="xl")
  q-item-section
    .title {{ $mt(m.title[0]) }}
    router-link.q-mt-md(:to="record.links.ui") detaily ...
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from 'src/components/icons/AccessIcon'

export default @Options({
  name: 'ListRecord',
  props: {
    record: Object
  },
  components: {
    AccessIcon
  }
})
class ListRecord extends Vue {
  get m() {
    return this.record?.metadata || {}
  }
}
</script>
