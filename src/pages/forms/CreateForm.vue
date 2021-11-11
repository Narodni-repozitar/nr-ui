<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding :key="$route.path")
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
    dataset-form.col.q-pr-md(:key="$route.path" mode="create" :steps="formSteps")
</template>
<script>
import {computed, defineComponent, ref, shallowRef} from 'vue'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'
import DatasetForm from 'components/forms/DatasetForm'
import {DATASET_FORM_STEPS} from 'src/constants'
import BasicInfoStep from 'components/forms/steps/BasicInfoStep'
import AuthorsContributorsStep from 'components/forms/steps/AuthorsContributorsStep'
import DatasetDescriptionStep from 'components/forms/steps/DatasetDescriptionStep'
import DatesStep from 'components/forms/steps/DatesStep'
import FundingInfoStep from 'components/forms/steps/FundingInfoStep'
import SubmissionStep from 'components/forms/steps/SubmissionStep'
import UploadDataStep from 'components/forms/steps/UploadDataStep'

export default defineComponent({
  name: 'CreateForm',
  components: {DatasetForm},
  setup() {
    const {t} = useI18n()
    const formSteps = shallowRef([
      {
        id: DATASET_FORM_STEPS.BASIC,
        component: BasicInfoStep
      },
      {
        id: DATASET_FORM_STEPS.AUTHORS,
        component: AuthorsContributorsStep,
        props: {
          splitName: true
        }
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
        id: DATASET_FORM_STEPS.SUBMISSION,
        component: SubmissionStep
      },
      {
        id: DATASET_FORM_STEPS.UPLOAD,
        component: UploadDataStep,
        useCreated: true
      }
    ])

    const header = computed(() => {
      return {
        title: 'route.title.datasetUpload',
        icon: 'addchart'
      }
    })

    useMeta(() => {
      return {title: header.value ? t(header.value.title) : ''}
    })


    return {header, formSteps}
  }
})
</script>
<style lang="sass">
</style>
