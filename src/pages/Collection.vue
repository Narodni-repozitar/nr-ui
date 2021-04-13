<template lang="pug">
q-page.min-window-height.q-mt-md.collection-page
  .row.items-stretch
    search-header.col-8(:collection="collection")
    selected-facets.col-4
  .row.items-stretch
    record-list.col-8.record-list(:collection="collection")
    collection-facets.col-4
</template>

<script>
import {Options, Vue} from 'vue-class-component'

import CollectionFacets from 'src/components/list/CollectionFacets';
import RecordList from 'src/components/list/RecordList';
import SearchHeader from 'src/components/list/SearchHeader';
import SelectedFacets from 'src/components/list/SelectedFacets';

export default @Options({
  name: 'Collection',
  props: {
    collection: Object
  },
  components: {
    CollectionFacets,
    RecordList,
    SearchHeader,
    SelectedFacets
  }
})
class Collection extends Vue {
  fullText = true
  searchField = ''

  search() {
    console.log(this.searchField)
    this.$router.push({
      path: '/all',
      query: {q: this.searchField}
    })
  }
}
</script>

<style scoped lang="sass">

.full-height
  height: 100vh
</style>
