<template lang="pug">
div
  q-list
    record-item.collection-item.q-py-lg(
      v-for="record in collection.records" :key="record.id"
      :record="record")
</template>
<style lang="sass">
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import RecordItem from './RecordItem'

export default @Options({
  name: 'RecordList',
  props: {
    collection: Object
  },
  components: {
    RecordItem
  }
})
class RecordList extends Vue {
}
</script>
