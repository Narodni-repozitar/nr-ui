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
  color="primary"
  animated)
  q-step(
    icon="info"
    :name="steps.BASIC"
    :title="$t('label.forms.datasetBasicInfo')"
    :done="step > steps.BASIC"
    done-icon="done"
    done-color="positive")
    basic-info(
      v-model="formData"
      @next="step = steps.AUTHORS")
  q-step(
    :disable="maxFilled < steps.AUTHORS"
    icon="groups"
    :name="steps.AUTHORS"
    :title="$t('label.forms.authorsContributors')"
    :done="step > steps.AUTHORS")
    authors-contributors(
      v-model="formData"
      @prev="step = steps.BASIC"
      @next="step = steps.DESCRIPTION")
  q-step(
    :disable="maxFilled < steps.DESCRIPTION"
    icon="analytics"
    :name="steps.DESCRIPTION"
    :title="$t('label.forms.datasetDescription')"
    :done="step > steps.DESCRIPTION")
    dataset-description(
      v-model="formData"
      @prev="step = steps.AUTHORS"
      @next="step = steps.DATES")
  q-step(
    :disable="maxFilled < steps.DATES"
    icon="date_range"
    :name="steps.DATES"
    :title="$t('label.forms.dates')"
    :done="step > steps.DATES")
    dates(
      v-model="formData"
      @prev="step = steps.DESCRIPTION"
      @next="step = steps.FUNDING")
  q-step(
    :disable="maxFilled < steps.FUNDING"
    icon="euro_symbol"
    :name="steps.FUNDING"
    :title="$t('label.forms.fundingInfo')"
    :done="step > steps.FUNDING")
    funding-info(
      v-model="formData"
      @prev="step = steps.DATES"
      @next="step = steps.SUBMISSION")
  q-step(
    :disable="maxFilled < steps.SUBMISSION"
    active-icon="published_with_changes"
    icon="published_with_changes"
    :name="steps.SUBMISSION"
    :title="$t('label.forms.submission')"
    :done="step > steps.SUBMISSION")
    submission(
      :data="formData"
      @prev="step = steps.FUNDING"
      @retry="step = steps.BASIC"
      @create="onCreated")
  q-step(
    :disable="maxFilled < steps.UPLOAD"
    icon="cloud_upload"
    :name="steps.UPLOAD"
    :title="$t('label.forms.uploadData')")
    .column.justify-center.items-center
      .col.text-h2
        q-icon.flex-center(color="positive" name="check_circle")
      .col.text-h5 {{ $t('message.submissionSuccess', {pid: created.metadata.id}) }}
    q-separator(spaced)
    .column.justify-center.items-center
      .col.text-subtitle1 {{ $t('label.forms.uploadData') }}
      upload-data(v-if="created" :files="created.links.files")
    .column.justify-center.items-center
      .col.text-subtitle1.q-my-md ~ {{ $t('label.or') }} ~
      .col
        q-btn(color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(created?.links?.self)")
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
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
    const formData = ref({})
    const step = ref(steps.BASIC)
    const maxFilled = ref(steps.BASIC)
    const created = ref(false)

    watch(step, () => {
      if (step.value > maxFilled.value) {
        maxFilled.value = step.value
      }
    })

    function onCreated(val) {
      created.value = val
      step.value = steps.UPLOAD
    }

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    return {formData, step, steps, maxFilled, created, onCreated, pathFromUrl}
  }
})
</script>

<style lang="sass" scoped>

</style>
