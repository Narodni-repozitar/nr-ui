<template lang="pug">
div.q-pa-md.q-pr-lg.search-header
  .row.full-width
    search-box()
  .row.justify-between.q-mt-lg.items-baseline
    .row
      .label Výsledků: {{ collection.recordsCountString }}
    .row.q-gutter-sm.items-baseline
      .label Řazení:
      q-select.short(dense outlined square :options="orderingOptions"
        emit-value map-options v-model="$query.sort")
    .row.q-gutter-sm.items-baseline
      .label Počet na stránku:
      q-select.short(dense outlined square :options="pageSizeOptions" v-model="$query.size")
  .row.q-pt-lg
    URLPagination(:pages="collection.pages")
</template>
<script>
import {Options, Vue} from 'vue-class-component'
import SearchBox from 'src/components/controls/SearchBox'
import URLPagination from 'src/components/controls/URLPagination'


export default @Options({
  name: 'SearchHeader',
  components: {
    SearchBox,
    URLPagination
  },
  props: {
    collection: Object
  }
})
class SearchHeader extends Vue {

  get orderingOptions() {
    return [
      {
        label: 'Abecední dle názvu',
        value: 'alphabetical'
      },
    ]
  }

  get pageSizeOptions() {
    return [10, 20, 50, 100, 500]
  }
}
</script>
