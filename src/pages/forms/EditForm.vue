<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding)
  .column.justify-center.items-center
    .col.row.q-pb-md
      .text-h3.gt-md.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{record.metadata? record.metadata.InvenioID : ''}}
      .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{record.metadata? record.metadata.InvenioID : ''}}
      .text-h6.lt-md.q-mt-none.q-mb-md.self-baseline
        p {{ header?.title }}
        p
          p.text-bold {{record.metadata? record.metadata.InvenioID : ''}}
    .q-separator(spaced)
    edit-dataset-form.col.q-pr-md(v-if="record.metadata" :record="record")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'
import EditDatasetForm from 'components/forms/EditDatasetForm'
import {useInvenioRecord} from '@oarepo/invenio-vue'
import {useRoute} from 'vue-router'

export default defineComponent({
  name: 'EditForm',
  components: {EditDatasetForm},
  setup () {
    const {t} = useI18n()
    const route = useRoute()
    const record = ref(null)
    const recordApi = route.path.substring(0, route.path.indexOf('/edit'))

    record.value = useInvenioRecord(recordApi, {loadInitial: true})

    const header = computed(() => {
      return {
        title: t('route.title.datasetEdit'),
        icon: 'edit'
      }
    })

    useMeta(() => {
      return {title: header.value? `${header.value.title} ${record.value.metadata? record.value.metadata.InvenioID : ''}` : ''}
    })

    return {header, record}
  }
})
</script>
<style lang="sass">
</style>
