<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding)
  .column.justify-center.items-center
    .col.row.q-pb-md
      .text-h3.gt-md
        span {{ $t(header?.title) }}
        q-icon.q-pl-md(color="primary" size="md" :name="header?.icon")
      .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg
        span {{ $t(header?.title) }}
        q-icon.q-pl-md(color="primary" size="sm" :name="header?.icon")
      .text-h6.lt-md.q-mt-none.q-mb-md
        span {{ $t(header?.title) }}
        q-icon.q-pl-md(color="primary" size="xs" :name="header?.icon")
    .q-separator(spaced)
    create-dataset-form.col.q-pr-md
</template>
<script>
import {computed, defineComponent} from 'vue'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'
import CreateDatasetForm from 'components/forms/CreateDatasetForm'

export default defineComponent({
  name: 'CreateForm',
  components: {CreateDatasetForm},
  setup () {
    const {t} = useI18n()

    const header = computed(() => {
      return {
        title: 'route.title.datasetUpload',
        icon: 'addchart'
      }
    })

    useMeta(() => {
      return {title: header.value? t(header.value.title) : ''}
    })

    return {header}
  }
})
</script>
<style lang="sass">
</style>