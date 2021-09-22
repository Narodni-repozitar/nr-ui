<template lang="pug">
q-stepper.full-width(
  ref="stepper"
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
  animated)
  component(
    v-for="(s, idx) in steps" :key="s.id"
    :is="s.component"
    :done="isDone(s.id)"
    :error="hasError(s.id)"
    :ref="el => stepRefs[s.id] = el"
    v-model="model[s.id.toLowerCase()]"
    v-bind="stepProps(s)"
    @validate="onStepValidate"
    @prev="stepper.goTo(idx > 0? steps[idx-1].id : s.id)"
    @next="stepper.goTo(idx === steps.length-1 ? s.id : steps[idx+1].id)"
    @create="onCreated")
</template>

<script>
import {computed, defineComponent, ref, watch} from 'vue'
import UploadData from 'components/forms/steps/UploadData'
import BasicInfo from 'components/forms/steps/BasicInfo'
import AuthorsContributors from 'components/forms/steps/AuthorsContributors'
import StepperNav from 'components/controls/StepperNav'
import DatasetDescription from 'components/forms/steps/DatasetDescription'
import FundingInfo from 'components/forms/steps/FundingInfo'
import Dates from 'components/forms/steps/Dates'
import Submission from 'components/forms/steps/Submission'
import {DATASET_FORM_STEPS, DEFAULT_AUTHOR_ITEM, DEFAULT_MAIN_TITLE, TAXONOMY_TERM_ENGLISH} from 'src/constants'
import {date} from 'quasar'
import deepcopy from 'deepcopy'
import BasicInfoStep from 'components/forms/steps/BasicInfoStep'
import AuthorsContributorsStep from 'components/forms/steps/AuthorsContributorsStep'
import DatasetDescriptionStep from 'components/forms/steps/DatasetDescriptionStep'
import DatesStep from 'components/forms/steps/DatesStep'
import FundingInfoStep from 'components/forms/steps/FundingInfoStep'
import SubmissionStep from 'components/forms/steps/SubmissionStep'
import UploadDataStep from 'components/forms/steps/UploadDataStep'
import {useI18n} from 'vue-i18n'

export const DEFAULT_VALUE = {
  basic: {
    titles: [DEFAULT_MAIN_TITLE],
    abstract: {},
    language: [TAXONOMY_TERM_ENGLISH],
    rights: {},
  },
  authors: {
    creators: [DEFAULT_AUTHOR_ITEM],
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
    steps: {
      type: Array,
      required: true
    },
    modelValue: Object
  },
  setup(props, ctx) {
    const {t} = useI18n()
    const stepper = ref(null)
    const created = ref(false)
    const model = ref(initModel())
    const step = ref(props.steps[0].id)
    const stepRefs = ref({})
    const progress = ref({})
    const maxFilled = ref(DATASET_FORM_STEPS.BASIC)

    watch(step, (newStep, prevStep) => {
      onStepChange(newStep, prevStep)
      if (step.value > maxFilled.value) {
        maxFilled.value = step.value
      }
    })

    function stepProps (s) {
      const props = {...s.props}
      if (s.id === DATASET_FORM_STEPS.SUBMISSION) {
        props.errors = errors.value
        props.hasErrors = hasErrors.value
        props.submissionData = submissionData.value
      }
      if (s.id === DATASET_FORM_STEPS.UPLOAD) {
        props.disable = !created.value
      }
      return props
    }

    function initModel() {
      if (props.mode === 'edit') {
        const flds = Object.entries(deepcopy(props.modelValue))

        return {
          basic: Object.fromEntries(flds.filter(([k, v]) => ['titles', 'abstract', 'language', 'rights'].includes(k))),
          authors: Object.fromEntries(flds.filter(([k, v]) => ['creators', 'contributors'].includes(k))),
          description: Object.fromEntries(flds.filter(([k, v]) => ['keywords', 'subjectCategories', 'methods', 'technicalInfo', 'notes'].includes(k))),
          dates: Object.fromEntries(flds.filter(([k, v]) => ['dateAvailable', 'dateCollected', 'dateCreated'].includes(k))),
          funding: Object.fromEntries(flds.filter(([k, v]) => ['fundingReferences'].includes(k))),
        }
      }
      return DEFAULT_VALUE
    }

    function onStepValidate(validatedStep, result) {
      progress.value[validatedStep] = result
    }

    function onStepChange(newStep, oldStep) {
      if (newStep !== DATASET_FORM_STEPS.SUBMISSION && oldStep !== DATASET_FORM_STEPS.SUBMISSION) {
        validateStep(oldStep)
      } else {
        for (const s of props.steps) {
          if (stepRefs.value[s.id].validate) {
            validateStep(s.id)
          }
        }
      }
    }

    async function validateStep(step) {
      if (stepRefs.value[step].visited) {
        // User visited the step -> validate step inputs
        await stepRefs.value[step].validate()
      } else {
        // Step was not visited -> error if required, ok otherwise
        progress.value[step] = !props.requiredSteps.includes(step)
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

    const submissionData = computed(() => {
      const res = {}
      for (const item of Object.values(model.value)) {
        Object.entries(item).map(([k, v]) => res[k] = v)
      }
      return res
    })

    const errors = computed(() => {
      return Object.keys(progress.value)
          .filter(k => progress.value[k] === false)
          .map(r => t(`label.forms.${r.toLowerCase()}`))
    })

    function onCreated(val) {
      created.value = val
      progress.value[DATASET_FORM_STEPS.SUBMISSION] = true
      stepper.value.goTo(DATASET_FORM_STEPS.UPLOAD)
    }

    return {
      stepper,
      model,
      created,
      maxFilled,
      submissionData,
      step,
      stepRefs,
      stepProps,
      progress,
      isDone,
      hasError,
      hasErrors,
      errors,
      onCreated,
      onStepValidate,
      DATASET_FORM_STEPS
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
