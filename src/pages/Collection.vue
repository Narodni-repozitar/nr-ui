<template lang="pug">
div.collection-page.q-mt-xl
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
  .row.q-py-lg.q-pl-md
    .col-8
      URLPagination(:pages="collection.pages")
    .col-4.row.justify-end
      q-btn(stack icon="svguse:/icons.svg#arrow-up"
        label="Zpět nahoru" color="primary" flat no-caps dense
        @click="scrollToTop"
        )
</template>
<script>
import {Options, Vue} from 'vue-class-component'

import CollectionFacets from 'src/components/list/CollectionFacets'
import RecordList from 'src/components/list/RecordList'
import SearchHeader from 'src/components/list/SearchHeader'
import SelectedFacets from 'src/components/list/SelectedFacets'
import URLPagination from 'src/components/controls/URLPagination'
import {defineComponent, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
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
  },
  setup() {
    const fullText = ref(true)
    const searchField = ref('')
    const drawer = ref(null)
    const activeFacets = ref(null)

    const router = useRouter()

    function search() {
      router.push({
        path: '/all',
        query: {q: searchField.value}
      })
    }

    function scrollToTop() {
      window.scrollTo(0, 0);
    }

    onMounted(() => {
      setTimeout(() => {
        drawer.value = '#facets-drawer'
      })
    })

    return {fullText, searchField, drawer, activeFacets, search, scrollToTop}
  }
})
</script>

<style scoped lang="sass">

.full-height
  height: 100vh
</style>
