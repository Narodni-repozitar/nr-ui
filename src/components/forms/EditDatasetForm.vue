<template lang="pug">
dataset-form(v-model="formData" mode="edit")
  //q-step(
  //  active-icon="published_with_changes"
  //  icon="published_with_changes"
  //  :error="failed"
  //  :name="steps.SUBMISSION"
  //  :title="$t('label.forms.saveChanges')"
  //  :done="step > steps.SUBMISSION")
  //  .text-subtitle1.text-negative(v-if="failed")
  //    .block {{ $t('error.saveChangesFail') }}
  //      q-icon.q-ml-sm(name="sentiment_very_dissatisfied")
  //  stepper-nav(
  //    :has-prev="!saved && !failed"
  //    :has-retry="!saved && failed"
  //    :has-next="false"
  //    :has-save="!saved"
  //    @submit="save"
  //    @prev="step = steps.AUTHORS"
  //    @retry="retry")
  //  q-btn(v-if="saved" color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(saved?.links?.self)")
  //  q-inner-loading(:showing="submitting")
  //    circular-spinner(:message="$t('message.savingChanges')")
</template>

<script>
import {defineComponent, ref} from 'vue'
import {axios} from 'src/boot/axios'
import useNotify from 'src/composables/useNotify'
import {useRouter} from 'vue-router'
import deepcopy from "deepcopy";
import DatasetForm from 'components/forms/DatasetForm'

export const steps = Object.freeze({
  BASIC: 1,
  IDENTIFIERS: 2,
  AUTHORS: 3,
  SUBMISSION: 5,
  UPLOAD: 4
})

export default defineComponent({
  name: 'EditDatasetForm',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  components: {DatasetForm},
  setup(props) {
    const {notifySuccess, notifyError} = useNotify()
    const router = useRouter()

    let formData = ref(deepcopy(props.record.metadata))
    const step = ref(steps.BASIC)
    const submitting = ref(false)
    const failed = ref(false)
    const saved = ref(false)

    function retry() {
      failed.value = false
      step.value = steps.BASIC
    }

    function _submissionFail(err) {
      console.log(err)
      failed.value = true
      notifyError('error.saveChangesFail')
    }

    function _submissionSuccess(response) {
      saved.value = response.data
      notifySuccess('message.saveChangesSuccess', {pid: saved.value.metadata.id})
      router.push(pathFromUrl(saved.value.links.self))
    }

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    function save() {
      submitting.value = true
      const submitUrl = props.record.http.data.links.self

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.put(submitUrl, JSON.stringify(formData.value), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => {
        if (res.status === 200) {
          _submissionSuccess(res)
          return
        }
        _submissionFail(res)
      }).catch(err => {
        _submissionFail(err)
      }).finally(() => {
        submitting.value = false
      })
    }

    return {formData, step, steps, saved, failed, save, retry, submitting, pathFromUrl}
  }
})
</script>

<style lang="sass" scoped>

</style>
