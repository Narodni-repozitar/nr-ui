<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding :key="$route.path")
  .column.justify-center.items-center
    .col.row.q-pb-md
      .text-h3.gt-md.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{record?.metadata? record.metadata.InvenioID : ''}}
      .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg.self-baseline.text-center
        p {{ header?.title }}
        p
          p.text-bold {{record?.metadata? record.metadata.InvenioID : ''}}
      .text-h6.lt-md.q-mt-none.q-mb-md.self-baseline
        p {{ header?.title }}
        p
          p.text-bold {{record?.metadata? record.metadata.InvenioID : ''}}
    q-separator(spaced)
    suspense
      template(#default)
        dataset-form.col.q-pr-md(
          ref="form"
          :key="$route.path"
          v-if="record?.metadata"
          v-model="record.metadata"
          mode="edit"
          :required-steps="[]",
          :steps="formSteps")
      template(#fallback)
        circular-spinner(:message="$t('message.loading')")
  fullscreen-loading(v-if="!record?.metadata" :message="$t('message.loading')")
  q-page-sticky(position="top-right" :offset="[18, 18]")
    .column.q-gutter-sm
      q-btn.col-auto(icon="save" outline color="positive" :label="$t('label.forms.saveChanges')" @click="saveChanges")
      q-btn.col-auto(icon="close"  outline color="accent" :label="$t('action.close')" @click="$router.back()")
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
import FullscreenLoading from "components/ui/FullscreenLoading";

export default defineComponent({
  name: 'EditForm',
  components: {
    FullscreenLoading,
    DatasetForm: defineAsyncComponent(() => import('components/forms/DatasetForm')),
    CircularSpinner},
  setup() {
    const form = ref(null)
    const {t} = useI18n()
    const route = useRoute()
    const record = ref(null)
    const recordApi = route.path.substring(0, route.path.indexOf('/edit')) + `?nocache=${Math.random()}`
    // const {metadata} = useInvenioRecord(recordApi, {loadInitial: true})
    record.value = useInvenioRecord(recordApi, {loadInitial: true})

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

    function saveChanges() {
      form.value.saveChanges()
    }

    useMeta(() => {
      return {title: header.value ? `${header.value.title} ${record.value?.metadata?.value ? record.value?.metadata?.value.InvenioID : ''}` : ''}
    })

    return {header, form, record, formSteps, saveChanges}
  }
})
</script>
<style lang="sass">
</style>
