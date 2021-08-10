<template lang="pug">
div.row.authors
  .creator(v-for="(creator, idx) in m.creator")
    vertical-separator(v-if="idx>0")
    span {{ creator.name }}
  template(v-if="m.contributor && m.contributor.length")
    double-separator
  separated-list(:list='m.contributor' item-class="contributor inline")
    template(v-slot:default="{item}")
      span {{ item.name }}
      span.role &nbsp;(
      simple-term.role.inline(:term="item.role")
      span.role )
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'RecordPeople',
  props: {
    m: Object
  },
  components: {}
})
class RecordList extends Vue {
}
</script>
