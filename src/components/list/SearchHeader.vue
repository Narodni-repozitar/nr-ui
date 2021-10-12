<template lang="pug">
div.q-pa-md.q-pr-lg.search-header
  .row.full-width
    search-box()
  .row.justify-between.q-mt-lg.items-baseline
    .row.q-gutter-sm.col-auto
      .label Výsledků:
      .text-weight-bold {{ collection.recordsCountString }}
    .row.q-gutter-sm.col-grow.q-px-lg
      .label.col-auto Řazení:
      q-select.short.col-grow(dense outlined square :options="orderingOptions"
        emit-value map-options v-model="$query.sort")
    .row.q-gutter-sm.col-auto
      .label Počet na stránku:
      q-select.short(dense outlined square :options="pageSizeOptions" v-model="$query.size")
  .row.q-pt-lg
    URLPagination(:pages="collection.pages")
</template>
<script>
import {Options, Vue} from 'vue-class-component'
import SearchBox from 'src/components/controls/SearchBox'
import URLPagination from 'src/components/controls/URLPagination'
import BaseSelect from "components/controls/selects/BaseSelect";
import {computed, defineComponent, ref} from "vue";
import {useI18n} from "vue-i18n";


export default defineComponent({
  name: 'SearchHeader',
  components: {
    SearchBox,
    URLPagination,
    BaseSelect
  },
  props: {
    collection: Object
  },
  setup() {
    const {t} = useI18n()

    const orderingOptions = computed(() => {
      return [
        {
          label: `${t('value.sort.alphabetical')} - ${t('value.sort.byName')} (${t('value.sort.descending')})`,
          value: '-by_titles'
        },
        {
          label: `${t('value.sort.alphabetical')} - ${t('value.sort.byName')} (${t('value.sort.ascending')})`,
          value: 'by_titles'
        },
        {
          label: `${t('value.sort.byRelevance')}`,
          value: 'by_relevance'
        },
        {
          label: `${t('value.sort.byDateAvailable')} (${t('value.sort.ascending')})`,
          value: 'by_available'
        },
        {
          label: `${t('value.sort.byDateAvailable')} (${t('value.sort.descending')})`,
          value: '-by_available'
        },
        {
          label: `${t('value.sort.byRecordStatus')}`,
          value: 'by_record_status_asc'
        },
      ]
    })

    const pageSizeOptions = ref([10, 20, 50, 100, 500])

    return {orderingOptions, pageSizeOptions}
  }
})
</script>
