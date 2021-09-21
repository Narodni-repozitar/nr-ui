<template lang="pug">
.column.q-gutter-sm
  q-card.text-negative(v-if="hasErrors" flat)
    q-card-section
      .text-h6.no-padding.no-margin.text-weight-bold.col {{ $t('section.submitRecordErrors') }}
    q-card-section
      q-list(dense)
        q-item(v-for="(item, idx) in errors" :key="idx")
          q-item-section(avatar)
            q-icon(name="error")
          q-item-section {{ item }}
    q-separator(inset)
  q-card(v-if="!failed" flat square)
    q-card-section
      .text-h6.text-weight-bold.col {{ $t('section.submitRecordMetadata') }}
    q-card-section
      label-block(:label="$t('label.titles')")
        span(v-for="(t, idx) in internalData.titles" :key="idx")
          span.text-weight-bold(v-for="(tt, idx) in Object.keys(t.title)" :key="idx") {{ t.title[tt] }} ({{ tt }}),
      label-block(:label="$t('label.language')")
        span.text-weight-bold(v-for="(l, idx) in internalData.language" :key="idx") {{ $mt(l.title) }}
      label-block(:label="$t('label.abstract')")
        span.text-weight-bold(v-for="(a, idx) in internalData.abstract? Object.keys(internalData.abstract): []" :key="idx") {{ internalData.abstract[a] }} ({{ a }}),
      label-block(:label="$t('label.license')" v-if="internalData.rights?.length")
        span.text-weight-bold {{ $mt(internalData.rights.title) }}
      label-block(:label="$t('label.authors')")
        span.text-weight-bold(v-for="(c, idx) in internalData.creators" :key="idx") {{ c.fullName }} ({{ c.affiliation? c.affiliation.map(a => $mt(a.title)): '' }}),
      label-block(:label="$t('label.contributors')" v-if="internalData.contributors?.length")
        span.text-weight-bold(v-for="(c, idx) in internalData.contributors" :key="idx") {{ c.fullName }} ({{ c.affiliation? c.affiliation.map(a => $mt(a.title)): ' ' }}),
      label-block(:label="$t('label.forms.keywords')" v-if="internalData.keywords?.length")
        span.text-weight-bold(v-for="(kw, idx) in internalData.keywords" :key="idx") {{ $mt(kw) }},
      label-block(:label="$t('label.methods')"  v-if="internalData.methods && Object.keys(internalData.methods).length")
        span.text-weight-bold {{ $mt(internalData.methods) }}
      label-block(:label="$t('label.technicalInfo')" v-if="internalData.technicalInfo && Object.keys(internalData.technicalInfo).length")
        span.text-weight-bold {{ $mt(internalData.technicalInfo) }}
      label-block(:label="$t('label.subjectCategories')")
        span.text-weight-bold(v-for="(s, idx) in internalData.subjectCategories" :key="idx") {{ $mt(s.title) }},
      label-block(:label="$t('label.notes')" v-if="internalData.notes?.length")
        span.text-weight-bold {{ internalData.notes }}
      label-block(:label="$t('label.dateAvailable')")
        span.text-weight-bold {{ internalData.dateAvailable }}
      label-block(:label="$t('label.dateCollected')" v-if="internalData.dateCollected")
        span.text-weight-bold {{ internalData.dateCollected }}
      label-block(:label="$t('label.dateCreated')" v-if="internalData.dateCreated")
        span.text-weight-bold {{ internalData.dateCreated }}
      label-block(:label="$t('label.funding')" v-if="internalData.fundingReferences?.length")
        span.text-weight-bold(v-for="(f, idx) in internalData.fundingReferences" :key="idx") {{ f.projectID }} ({{$mt(f.funder.title)}})
  q-card.col.full-width(v-else flat square)
    q-card-section
      .text-h6.text-negative {{ $t('error.submissionFail') }}: "{{ error.message }}"
        q-icon.q-ml-sm.q-pb-sm(size="md" name="sentiment_very_dissatisfied")
    q-card-section.full-width
      .text-subtitle1 {{ $t('error.detail') }}
      pre.bg-red-1.rounded-borders.q-pa-md.text-caption.text-weight-medium.wrap {{ JSON.stringify({config: error.config, message: error.message, name: error.name, time: new Date()}, null, 2) }}
      q-btn.q-ma-xl.absolute-bottom-right(
        @click="reportError"
        color="negative"
        outline
        icon="bug_report"
        :label="$t('action.bugReport')")
  stepper-nav(
    :has-prev="!created && !failed"
    :has-retry="!created && failed"
    :has-submit="!created && !failed && !hasErrors"
    :has-next="false"
    @submit="submit"
    @prev="$emit('prev')"
    @retry="retry")
  q-inner-loading(:showing="submitting")
    circular-spinner(:message="$t('message.submitting')")
  .text-body2.col.q-ml-sm(v-if="!failed")
    q-icon.q-pr-sm.q-py-sm(size="sm" :color="!hasErrors? 'info': 'negative'" :name="!hasErrors? 'info': 'warning'")
    span.text-caption(v-if="!hasErrors") {{ $t('message.submissionInfo') }}
    span.text-caption.text-negative {{ $t('message.submissionHasErrors') }}
</template>
<script>
import {defineComponent, ref} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import {axios} from 'boot/axios'
import deepcopy from 'deepcopy'
import CircularSpinner from 'components/ui/CircularSpinner'
import LabelBlock from 'components/record/LabelBlock'
import {PRIMARY_COMMUNITY_FIELD, TAXONOMY_TERM_DATASET, TAXONOMY_TERM_RESTRICTED} from 'src/constants'
import useAuth from 'src/composables/useAuth'

export default defineComponent({
  name: 'Submission',
  components: {
    CircularSpinner,
    StepperNav,
    LabelBlock
  },
  emits: ['create', 'prev', 'retry'],
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    const submitting = ref(false)
    const failed = ref(false)
    const error = ref(null)
    const created = ref(false)
    const internalData = ref(deepcopy(props.data))

    const {effectiveCommunity} = useAuth()
    const {notifyError, notifySuccess, submitBugReport} = useNotify()

    function _submissionFail(err) {
      console.log(err)
      failed.value = true
      error.value = err
      notifyError('error.submissionFail')
    }

    function _submissionSuccess(response) {
      created.value = response.data
      notifySuccess('message.submissionSuccess', {pid: created.value.id})
    }

    function retry() {
      failed.value = false
      ctx.emit('retry')
    }

    function reportError() {
      submitBugReport(error.value)
      retry()
    }

    function submit() {
      submitting.value = true

      // Set internal metadata fields

      // TODO: properly set primary community on metadata
      internalData.value[PRIMARY_COMMUNITY_FIELD] = effectiveCommunity.value.id
      // AccessRights - for datasets will always be 'open access'
      internalData.value['accessRights'] = TAXONOMY_TERM_RESTRICTED
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

    return {internalData, created, failed, error, submit, reportError, retry, submitting}
  }
})
</script>
<style lang="sass" scoped>
</style>
