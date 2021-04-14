<template lang="pug">
q-page.min-window-height.q-mt-md.collection-page
  q-icon(name="svguse:/icons.svg#arrow-right")
  .row.items-stretch
    search-header.col-8(:collection="collection")
    selected-facets.col-4
  .row.items-stretch
    record-list.col-8.record-list(:collection="collection")
    collection-facets.col-4(:collection="collection")
  .row
    .col-8
      q-separator(color="secondary")
      URLPagination.q-py-lg.q-pl-lg(:pages="collection.pages")
    .col-4
      q-btn(stack icon="caret_up" label="TODO Zpět nahoru" color="primary" flat no-caps)
</template>

<script>
import {Options, Vue} from 'vue-class-component'

import CollectionFacets from 'src/components/list/CollectionFacets';
import RecordList from 'src/components/list/RecordList';
import SearchHeader from 'src/components/list/SearchHeader';
import SelectedFacets from 'src/components/list/SelectedFacets';
import URLPagination from 'src/components/controls/URLPagination';

export default @Options({
  name: 'Collection',
  props: {
    collection: Object
  },
  components: {
    CollectionFacets,
    RecordList,
    SearchHeader,
    SelectedFacets,
    URLPagination
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
