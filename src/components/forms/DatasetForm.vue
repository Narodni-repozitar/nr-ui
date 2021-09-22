<template lang="pug">
q-stepper.full-width(
  flat
  keep-alive
  v-model="step"
  header-nav
  doneIcon="done"
  done-color="positive"
  vertical
  bordered
  error-color="negative"
  inactive-color="dark"
  color="primary"
  @before-transition="onStepChange"
  animated)
  basic-info-step(
    :done="isDone(steps.BASIC)"
    :error="hasError(steps.BASIC)"
    :ref="el => stepRefs[steps.BASIC] = el"
    v-model="model.basic"
    @validate="onStepValidate"
    @next="step = steps.AUTHORS")
  authors-contributors-step(
    :done="isDone(steps.AUTHORS)"
    :error="hasError(steps.AUTHORS)"
    :ref="el => stepRefs[steps.AUTHORS] = el"
    v-model="model.authors"
    @validate="onStepValidate"
    @prev="step = steps.BASIC"
    @next="step = steps.DESCRIPTION")
  dataset-description-step(
    :done="isDone(steps.DESCRIPTION)"
    :error="hasError(steps.DESCRIPTION)"
    :ref="el => stepRefs[steps.DESCRIPTION] = el"
    v-model="model.description"
    @validate="onStepValidate"
    @prev="step = steps.AUTHORS"
    @next="step = steps.DATES")
  dates-step(
    :done="isDone(steps.DATES)"
    :error="hasError(steps.DATES)"
    :ref="el => stepRefs[steps.DATES] = el"
    v-model="model.dates"
    @validate="onStepValidate"
    @prev="step = steps.DESCRIPTION"
    @next="step = steps.FUNDING")
  funding-info-step(
    :done="isDone(steps.FUNDING)"
    :error="hasError(steps.FUNDING)"
    :ref="el => stepRefs[steps.FUNDING] = el"
    v-model="model.funding"
    @validate="onStepValidate"
    @prev="step = steps.DATES"
    @next="step = steps.SUBMISSION")
  submission-step(
    :errors="errors"
    :has-errors="hasErrors"
    :submission-data="submissionData"
    :done="step > steps.SUBMISSION"
    @prev="step = steps.FUNDING"
    @create="onCreated")
  upload-data-step(
    :disable="maxFilled < steps.UPLOAD"
    :record="created")
</template>

<script>
import {computed, defineComponent, reactive, ref, watch} from 'vue'
import UploadData from 'components/forms/steps/UploadData'
import BasicInfo from 'components/forms/steps/BasicInfo'
import AuthorsContributors from 'components/forms/steps/AuthorsContributors'
import StepperNav from 'components/controls/StepperNav'
import DatasetDescription from 'components/forms/steps/DatasetDescription'
import FundingInfo from 'components/forms/steps/FundingInfo'
import Dates from 'components/forms/steps/Dates'
import Submission from 'components/forms/steps/Submission'
import {DATASET_FORM_STEPS, DEFAULT_MAIN_TITLE, TAXONOMY_TERM_ENGLISH} from 'src/constants'
import {date} from 'quasar'
import deepcopy from 'deepcopy'
import BasicInfoStep from 'components/forms/steps/BasicInfoStep'
import AuthorsContributorsStep from 'components/forms/steps/AuthorsContributorsStep'
import DatasetDescriptionStep from 'components/forms/steps/DatasetDescriptionStep'
import DatesStep from "components/forms/steps/DatesStep";
import FundingInfoStep from "components/forms/steps/FundingInfoStep";
import SubmissionStep from "components/forms/steps/SubmissionStep";
import UploadDataStep from "components/forms/steps/UploadDataStep";

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

export default defineComponent({
  name: 'DatasetForm',
  emits: ['update:modelValue'],
  components: {
    UploadDataStep,
    SubmissionStep,
    FundingInfoStep,
    DatesStep,
    DatasetDescriptionStep,
    AuthorsContributorsStep,
    BasicInfoStep,
    Submission,
    DatasetDescription,
    AuthorsContributors,
    BasicInfo,
    FundingInfo,
    Dates,
    UploadData,
    StepperNav,
  },
  props: {
    mode: {
      type: String  // 'edit' | 'create'
    },
    requiredSteps: {
      type: Array,
      default: () => [DATASET_FORM_STEPS.BASIC, DATASET_FORM_STEPS.AUTHORS, DATASET_FORM_STEPS.DESCRIPTION]
    },
    modelValue: Object
  },
  setup(props, ctx) {
    const created = ref(false)
    const model = ref(props.mode === 'edit' ? initModel() : DEFAULT_VALUE)
    const steps = reactive(DATASET_FORM_STEPS)
    const step = ref(steps.BASIC)
    const stepRefs = ref({})
    const progress = ref({})
    const maxFilled = ref(steps.BASIC)

    const submissionData = computed(() => {
      return reactive({
        ...Object.values(model.value)
      })
    })

    watch(step, () => {
      if (step.value > maxFilled.value) {
        maxFilled.value = step.value
      }
    })

    function initModel() {
      const flds = Object.entries(deepcopy(props.modelValue))

      return {
        basic: Object.fromEntries(flds.filter(([k, v]) => ['titles', 'abstract', 'language', 'rights'].includes(k))),
        authors: Object.fromEntries(flds.filter(([k, v]) => ['creators', 'contributors'].includes(k))),
        description: Object.fromEntries(flds.filter(([k, v]) => ['keywords', 'subjectCategories', 'methods', 'technicalInfo', 'notes'].includes(k))),
        dates: Object.fromEntries(flds.filter(([k, v]) => ['dateAvailable', 'dateCollected', 'dateCreated'].includes(k))),
        funding: Object.fromEntries(flds.filter(([k, v]) => ['fundingReferences'].includes(k))),
      }
    }

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
        progress.value[step] = !props.requiredSteps.includes(step);
      }
    }

    function isDone(step) {
      return progress.value[step] === true
    }

    function hasError(step) {
      return progress.value[step] === false
    }

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

    function onCreated(val) {
      created.value = val
      step.value = steps.UPLOAD
    }

    return {
      model,
      created,
      maxFilled,
      submissionData,
      steps,
      step,
      stepRefs,
      progress,
      isDone,
      hasError,
      hasErrors,
      errors,
      onCreated,
      onStepChange,
      onStepValidate
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
