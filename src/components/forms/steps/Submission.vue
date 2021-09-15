<template lang="pug">
.column.q-gutter-sm
  .text-subtitle1.text-weight-bold.col(v-if="!failed") {{ $t('section.submitRecordMetadata') }}
  label-block(:label="$t('label.titles')")
    span(v-for="(t, idx) in internalData.titles" :key="idx")
      span(v-for="(tt, idx) in Object.keys(t.title)" :key="idx") {{ t.title[tt] }} ({{ tt }}),
  label-block(:label="$t('label.language')")
    span(v-for="(l, idx) in internalData.language" :key="idx") {{ $mt(l.title) }}
  label-block(:label="$t('label.abstract')")
    span(v-for="(a, idx) in Object.keys(internalData.abstract)" :key="idx") {{ internalData.abstract[a] }} ({{ a }}),
  label-block(:label="$t('label.license')" v-if="internalData.rights")
    span {{ $mt(internalData.rights.title) }}
  label-block(:label="$t('label.authors')")
    pre {{ internalData }}
  .text-subtitle1.col.text-negative(v-if="failed")
    .block {{ $t('error.submissionFail') }}
      q-icon.q-ml-sm(name="sentiment_very_dissatisfied")
  stepper-nav(
    :has-prev="!created && !failed"
    :has-retry="!created && failed"
    :has-submit="!created && !failed"
    :has-next="false"
    @submit="submit"
    @prev="$emit('prev')"
    @retry="retry")
    q-inner-loading(:showing="submitting")
      circular-spinner(:message="$t('message.submitting')")
  .text-body2.col
    q-icon.q-pr-sm.q-py-sm(size="md" color="accent" name="info")
    span {{ $t('message.submissionInfo') }}
</template>
<script>
import {defineComponent, ref} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import {axios} from 'boot/axios'
import deepcopy from 'deepcopy'
import CircularSpinner from 'components/ui/CircularSpinner'
import LabelBlock from 'components/record/LabelBlock'
import {PRIMARY_COMMUNITY_FIELD, TAXONOMY_TERM_DATASET, TAXONOMY_TERM_OPENACCESS} from 'src/constants'

export default defineComponent({
  name: 'Submission',
  components: {
    CircularSpinner,
    StepperNav,
    LabelBlock
  },
  emits: ['create', 'prev', 'retry'],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    const submitting = ref(false)
    const failed = ref(false)
    const created = ref(false)
    const internalData = ref(deepcopy(props.data))

    const {notifyError, notifySuccess} = useNotify()

    function _submissionFail(err) {
      console.log(err)
      failed.value = true
      notifyError('error.submissionFail')
    }

    function _submissionSuccess(response) {
      created.value = response.data
      notifySuccess('message.submissionSuccess', {pid: created.value.metadata.id})
    }

    function retry() {
      failed.value = false
      ctx.emit('retry')
    }

    function submit() {
      submitting.value = true

      // Set internal metadata fields

      // TODO: properly set primary community on metadata
      internalData.value[PRIMARY_COMMUNITY_FIELD] = 'cesnet'
      // AccessRights - for datasets will always be 'open access'
      internalData.value['accessRights'] = TAXONOMY_TERM_OPENACCESS
      // We support datasets ResourceType only
      internalData.value['resourceType'] = TAXONOMY_TERM_DATASET

      const submitUrl = `/${internalData.value[PRIMARY_COMMUNITY_FIELD]}/datasets/draft/`

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.post(submitUrl, JSON.stringify(internalData.value), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => {
        if (res.status === 201) {
          _submissionSuccess(res)
          ctx.emit('create', created.value)
          return
        }
        _submissionFail(res)
      }).catch(err => {
        _submissionFail(err)
      }).finally(() => {
        submitting.value = false
      })
    }

    return {internalData, created, failed, submit, retry}
  }
})
</script>
<style lang="sass" scoped>
</style>
