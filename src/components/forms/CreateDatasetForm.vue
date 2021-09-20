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
  q-step(
    icon="info"
    :done="isDone(steps.BASIC)"
    :error="hasError(steps.BASIC)"
    error-icon="info"
    :name="steps.BASIC"
    :title="$t('label.forms.datasetBasicInfo')")
    basic-info(
      :ref="el => stepRefs[steps.BASIC] = el"
      ref="basicInfo"
      v-model="formData"
      @validate="onStepValidate(steps.BASIC, $event)"
      @next="step = steps.AUTHORS")
  q-step(
    icon="groups"
    error-icon="groups"
    :done="isDone(steps.AUTHORS)"
    :error="hasError(steps.AUTHORS)"
    :name="steps.AUTHORS"
    :title="$t('label.forms.authorsContributors')")
    authors-contributors(
      :ref="el => stepRefs[steps.AUTHORS] = el"
      v-model="formData"
      @validate="onStepValidate(steps.AUTHORS, $event)"
      @prev="step = steps.BASIC"
      @next="step = steps.DESCRIPTION")
  q-step(
    icon="analytics"
    error-icon="analytics"
    :done="isDone(steps.DESCRIPTION)"
    :error="hasError(steps.DESCRIPTION)"
    :name="steps.DESCRIPTION"
    :title="$t('label.forms.datasetDescription')")
    dataset-description(
      :ref="el => stepRefs[steps.DESCRIPTION] = el"
      v-model="formData"
      @validate="onStepValidate(steps.DESCRIPTION, $event)"
      @prev="step = steps.AUTHORS"
      @next="step = steps.DATES")
  q-step(
    icon="date_range"
    error-icon="date_range"
    :done="isDone(steps.DATES)"
    :error="hasError(steps.DATES)"
    :name="steps.DATES"
    :title="$t('label.forms.dates')")
    dates(
      :ref="el => stepRefs[steps.DATES] = el"
      v-model="formData"
      @validate="onStepValidate(steps.DATES, $event)"
      @prev="step = steps.DESCRIPTION"
      @next="step = steps.FUNDING")
  q-step(
    icon="euro_symbol"
    error-icon="euro_symbol"
    :done="isDone(steps.FUNDING)"
    :error="hasError(steps.FUNDING)"
    :name="steps.FUNDING"
    :title="$t('label.forms.fundingInfo')")
    funding-info(
      :ref="el => stepRefs[steps.FUNDING] = el"
      v-model="formData"
      @validate="onStepValidate(steps.FUNDING, $event)"
      @prev="step = steps.DATES"
      @next="step = steps.SUBMISSION")
  q-step(
    icon="published_with_changes"
    :done="step > steps.SUBMISSION"
    :name="steps.SUBMISSION"
    :title="$t('label.forms.submission')")
    submission(
      :has-errors="hasErrors"
      :ref="el => stepRefs[steps.SUBMISSION] = el"
      :data="formData"
      @prev="step = steps.FUNDING"
      @create="onCreated")
  q-step(
    :disable="maxFilled < steps.UPLOAD"
    icon="cloud_upload"
    :name="steps.UPLOAD"
    :title="$t('label.forms.uploadData')")
    .column.justify-center.items-center
      .col.text-h2
        q-icon.flex-center(color="positive" name="check_circle")
      .col.text-h5 {{ $t('message.submissionSuccess', {pid: created.metadata.InvenioID}) }}
    q-separator(spaced)
    .column.justify-center.items-center
      .col.text-subtitle1 {{ $t('label.forms.uploadData') }}
      upload-data(
        :ref="el => stepRefs[steps.UPLOAD] = el"
        v-if="created"
        :files="created.links.files")
    .column.justify-center.items-center
      .col.text-subtitle1.q-my-md ~ {{ $t('label.or') }} ~
      .col
        q-btn(color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(created?.links?.self)")
</template>

<script>
import {computed, defineComponent, ref, watch} from 'vue'
import UploadData from 'components/forms/steps/UploadData'
import BasicInfo from 'components/forms/steps/BasicInfo'
import Identifiers from 'components/forms/steps/Identifiers'
import AuthorsContributors from 'components/forms/steps/AuthorsContributors'
import StepperNav from 'components/controls/StepperNav'
import DatasetDescription from 'components/forms/steps/DatasetDescription'
import FundingInfo from 'components/forms/steps/FundingInfo'
import Dates from 'components/forms/steps/Dates'
import Submission from 'components/forms/steps/Submission'

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
    const progress = ref({})
    const formData = ref({})
    const step = ref(steps.BASIC)
    const maxFilled = ref(steps.BASIC)
    const created = ref(false)
    const stepRefs = ref({})
    const requiredSteps = ref([
      steps.BASIC, steps.AUTHORS, steps.DESCRIPTION
    ])

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

    const hasErrors = computed(() => {
      return Object.values(progress.value).some(val => val === false)
    })

    function onStepValidate(validatedStep, result) {
      progress.value[validatedStep] = result
    }

    function onStepChange(newStep, oldStep) {
      if (newStep !== steps.SUBMISSION) {
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
      step,
      steps,
      maxFilled,
      created,
      progress,
      stepRefs,
      hasErrors,
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
