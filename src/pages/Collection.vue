<template lang="pug">
div.collection-page
  .row.items-stretch
    search-header.col-8(:collection="collection")
    selected-facets.col-4(:activeFacets="activeFacets")
  a(name="top")
  .row.items-stretch
    record-list.col-8.record-list(:collection="collection")
    collection-facets.col-4(:collection="collection"
      :drawer="drawer" v-model:activeFacets="activeFacets")
  .row
    .col-8
      q-separator(color="secondary")
  .row.q-py-lg.q-pl-lg
    .col-8
      URLPagination.q-mt-md(:pages="collection.pages")
    .col-4.row.justify-end
      q-btn(stack icon="svguse:/icons.svg#arrow-up"
        label="Zpět nahoru" color="primary" flat no-caps dense
        @click="scrollToTop"
        )
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
  drawer = null
  activeFacets = null

  search() {
    console.log(this.searchField)
    this.$router.push({
      path: '/all',
      query: {q: this.searchField}
    })
  }

  scrollToTop() {
    window.scrollTo(0,0);
  }

  mounted() {
    setTimeout(() => {
      this.drawer = '#facets-drawer'
    })
  }
}
</script>

<style scoped lang="sass">

.full-height
  height: 100vh
</style>
