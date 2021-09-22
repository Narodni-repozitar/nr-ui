<template lang="pug">
dataset-form(v-model="formData" mode="create")
</template>

<script>
import {computed, defineComponent, reactive, ref, watch} from 'vue'
import UploadData from 'components/forms/steps/UploadData'
import BasicInfo from 'components/forms/steps/BasicInfo'
import Identifiers from 'components/forms/steps/Identifiers'
import AuthorsContributors from 'components/forms/steps/AuthorsContributors'
import StepperNav from 'components/controls/StepperNav'
import DatasetDescription from 'components/forms/steps/DatasetDescription'
import FundingInfo from 'components/forms/steps/FundingInfo'
import Dates from 'components/forms/steps/Dates'
import Submission from 'components/forms/steps/Submission'
import {useI18n} from 'vue-i18n'
import {DEFAULT_AUTHOR_ITEM, DEFAULT_MAIN_TITLE, TAXONOMY_TERM_ENGLISH} from 'src/constants'
import {date} from 'quasar'
import DatasetForm from "components/forms/DatasetForm";

export const DEFAULT_VALUE = {
  basic: {
    titles: [DEFAULT_MAIN_TITLE],
    abstract: {},
    language: [TAXONOMY_TERM_ENGLISH],
    rights: {},
  },
  authors: {
    creators: [],
    contributors: [],
  },
  description: {},
  dates: {
    dateAvailable: date.formatDate(new Date(), 'YYYY-MM-DD'),
  },
  funding: {
    fundingReferences: [],
  }
}

export const steps = Object.freeze({
  BASIC: 1,
  AUTHORS: 2,
  DESCRIPTION: 3,
  DATES: 4,
  FUNDING: 5,
  SUBMISSION: 6,
  UPLOAD: 7
})

export default defineComponent({
  name: 'CreateDatasetForm',
  components: {
    DatasetForm,
    Submission,
    DatasetDescription,
    AuthorsContributors,
    BasicInfo,
    FundingInfo,
    Dates,
    UploadData,
    Identifiers,
    StepperNav,
  },
  setup() {
    const {t} = useI18n()
    const progress = ref({})
    const formData = ref(DEFAULT_VALUE)
    const step = ref(steps.BASIC)
    const maxFilled = ref(steps.BASIC)
    const created = ref(false)
    const stepRefs = ref({})
    const requiredSteps = ref([
      steps.BASIC, steps.AUTHORS, steps.DESCRIPTION
    ])

    //TODO: figure out how to pass default author name
    // const default_names = currentUserName.value.split(' ')
    if (!formData.value.authors.creators.length) {
      formData.value.authors.creators.push({
        ...DEFAULT_AUTHOR_ITEM,
        // ...{
        //   givenName: default_names[0],
        //   familyName: default_names[default_names.length -1]
        // }
      })
    }

    watch(step, () => {
      if (step.value > maxFilled.value) {
        maxFilled.value = step.value
      }
    })

    function isDone(step) {
      return progress.value[step] === true
    }

    function hasError(step) {
      return progress.value[step] === false
    }

    const submissionData = computed(() => {
      return reactive({
        ...formData.value.basic,
        ...formData.value.authors,
        ...formData.value.description,
        ...formData.value.dates,
        ...formData.value.funding
      })
    })

    const hasErrors = computed(() => {
      return Object.values(progress.value).some(val => val === false)
    })

    const errors = computed(() => {
      return Object.keys(progress.value)
          .filter(k => progress.value[k] === false)
          .map(r => Object.keys(steps).find(key => {
            return steps[key] === parseInt(r)
          })).map(r => t(`label.forms.${r.toLowerCase()}`))
    })

    function onStepValidate(validatedStep, result) {
      progress.value[validatedStep] = result
    }

    function onStepChange(newStep, oldStep) {
      if (newStep !== steps.SUBMISSION && oldStep !== steps.SUBMISSION) {
        validateStep(oldStep)
      } else {
        for (const s of Object.values(steps)) {
          if (s < steps.SUBMISSION) {
            validateStep(s)
          }
        }
      }
    }

    async function validateStep(step) {
      if (stepRefs.value[step]) {
        // User visited the step -> validate step inputs
        await stepRefs.value[step].validate()
      } else {
        // Step was not visited -> error if required, ok otherwise
        progress.value[step] = !requiredSteps.value.includes(step);
      }
    }

    function onCreated(val) {
      created.value = val
      step.value = steps.UPLOAD
    }

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    return {
      formData,
      submissionData,
      step,
      steps,
      maxFilled,
      created,
      progress,
      stepRefs,
      hasErrors,
      errors,
      isDone,
      hasError,
      onStepValidate,
      onStepChange,
      onCreated,
      pathFromUrl
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
