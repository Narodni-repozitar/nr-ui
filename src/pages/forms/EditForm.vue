<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding)
  .column.justify-center.items-center
    .col.row.q-pb-md
      .text-h3.gt-md.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{metadata? metadata.InvenioID : ''}}
      .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{metadata? metadata.InvenioID : ''}}
      .text-h6.lt-md.q-mt-none.q-mb-md.self-baseline
        p {{ header?.title }}
        p
          p.text-bold {{metadata? metadata.InvenioID : ''}}
    q-separator(spaced)
    suspense
      template(#default)
        dataset-form.col.q-pr-md(
          v-if="metadata"
          v-model="metadata"
          mode="edit"
          :required-steps="[]",
          :steps="formSteps")
      template(#fallback)
        circular-spinner(:message="$t('message.loading')")
</template>
<script>
import {computed, defineComponent, defineAsyncComponent, ref, shallowRef} from 'vue'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useInvenioRecord} from '@oarepo/invenio-vue'
import {useRoute} from 'vue-router'
import {DATASET_FORM_STEPS} from "src/constants";
import BasicInfoStep from "components/forms/steps/BasicInfoStep";
import AuthorsContributorsStep from "components/forms/steps/AuthorsContributorsStep";
import DatasetDescriptionStep from "components/forms/steps/DatasetDescriptionStep";
import DatesStep from "components/forms/steps/DatesStep";
import FundingInfoStep from "components/forms/steps/FundingInfoStep";
import SubmissionStep from "components/forms/steps/SubmissionStep";
import UploadDataStep from "components/forms/steps/UploadDataStep";
import CircularSpinner from "components/ui/CircularSpinner";

export default defineComponent({
  name: 'EditForm',
  components: {
    DatasetForm: defineAsyncComponent(() => import('components/forms/DatasetForm')),
    CircularSpinner},
  setup() {
    const {t} = useI18n()
    const route = useRoute()
    const record = ref(null)
    const recordApi = route.path.substring(0, route.path.indexOf('/edit'))
    const {metadata} = useInvenioRecord(recordApi, {loadInitial: true})
    record.value = useInvenioRecord(recordApi, {loadInitial: true})
    const submitUrl = computed(() => {
      return record.value?.http?.data?.links.self
    })
    const formSteps = shallowRef([
      {
        id: DATASET_FORM_STEPS.BASIC,
        component: BasicInfoStep
      },
      {
        id: DATASET_FORM_STEPS.AUTHORS,
        component: AuthorsContributorsStep,
      },
      {
        id: DATASET_FORM_STEPS.DESCRIPTION,
        component: DatasetDescriptionStep,
      },
      {
        id: DATASET_FORM_STEPS.DATES,
        component: DatesStep
      },
      {
        id: DATASET_FORM_STEPS.FUNDING,
        component: FundingInfoStep
      },
      {
        id: DATASET_FORM_STEPS.UPLOAD,
        component: UploadDataStep,
        props: {
          record: record,
          useFileList: true
        }
      },
      {
        id: DATASET_FORM_STEPS.SUBMISSION,
        component: SubmissionStep,
        props: {
          mode: 'save',
          record: record
        }
      }
    ])

    const header = computed(() => {
      return {
        title: t('route.title.datasetEdit'),
        icon: 'edit'
      }
    })

    useMeta(() => {
      return {title: header.value ? `${header.value.title} ${metadata.value ? metadata.value.InvenioID : ''}` : ''}
    })

    return {header, record, metadata, formSteps}
  }
})
</script>
<style lang="sass">
</style>
