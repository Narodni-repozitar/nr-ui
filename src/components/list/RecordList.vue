<template lang="pug">
div
  q-list
    list-record.collection-item.q-py-lg(
      v-for="record in collection.records" :key="record.id"
      :record="record")
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import ListRecord from './Record'

export default @Options({
  name: 'RecordList',
  props: {
    collection: Object
  },
  components: {
    ListRecord
  }
})
class RecordList extends Vue {
}
</script>
