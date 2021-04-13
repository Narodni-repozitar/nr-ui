<template lang="pug">
div.q-pa-md.q-pr-lg
  .row.full-width
    q-input.full-width(color="primary" outlined square dense)
      template(v-slot:prepend)
        q-icon(name="search")
  .row.justify-between.q-mt-lg.items-baseline
    .row
      .label Výsledků: 63453
    .row.q-gutter-sm.items-baseline
      .label Řazení:
      q-select(dense outlined square :options="orderingOptions"
        emit-value map-options v-model="ordering")
    .row.q-gutter-sm.items-baseline
      .label Počet na stránku:
      q-select(dense outlined square :options="pageSizeOptions" v-model="pageSize")
  .row
    span 1 ... 2 3 4 5 6 7 8 9 ...
</template>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'SearchHeader'
})
class SearchHeader extends Vue {
  ordering = 'alphabetical'
  pageSize = 10

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
