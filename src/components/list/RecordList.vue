<template lang="pug">
div
  q-list
    q-item.collection-item.q-py-lg(v-for="record in collection.records" :key="record.id")
      q-item-section(avatar)
      q-item-section
        div {{ record.metadata.title }}
        router-link.q-mt-md(:to="record.links.ui") detaily ...
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'RecordList',
  props: {
    collection: Object
  }
})
class RecordList extends Vue {
}
</script>
