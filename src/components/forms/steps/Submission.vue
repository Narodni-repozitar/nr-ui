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
    q-card-section.q-ml-lg
      label-block(:label="$t('label.titles')")
        span(v-for="(t, idx) in data.titles" :key="idx")
          span.text-weight-bold(v-for="(tt, idx) in Object.keys(t.title)" :key="idx") {{ t.title[tt] }} ({{ tt }}),
      label-block(:label="$t('label.language')" v-if="data.language")
        span.text-weight-bold(v-for="(l, idx) in data.language" :key="idx") {{ $mt(l.title) }},
      label-block(:label="$t('label.abstract')")
        span.text-weight-bold(v-for="(a, idx) in data.abstract? Object.keys(data.abstract): []" :key="idx") {{ data.abstract[a] }} ({{ a }}),
      label-block(:label="$t('label.license')" v-if="Object.keys(data.rights).length")
        span.text-weight-bold {{ $mt(data.rights.title) }}
      label-block(:label="$t('label.authors')")
        span.text-weight-bold(v-for="(c, idx) in data.creators" :key="idx") {{ c.fullName }} ({{ c.affiliation? c.affiliation.map(a => $mt(a.title)): '' }}),
      label-block(:label="$t('label.contributors')" v-if="data.contributors?.length")
        span.text-weight-bold(v-for="(c, idx) in data.contributors" :key="idx") {{ c.fullName }} ({{ c.affiliation? c.affiliation.map(a => $mt(a.title)): ' ' }}),
      label-block(:label="$t('label.forms.keywords')" v-if="data.keywords?.length")
        span.text-weight-bold(v-for="(kw, idx) in data.keywords" :key="idx") {{ $mt(kw) }},
      label-block(:label="$t('label.methods')"  v-if="data.methods && Object.keys(data.methods).length")
        span.text-weight-bold {{ $mt(data.methods) }}
      label-block(:label="$t('label.technicalInfo')" v-if="data.technicalInfo && Object.keys(data.technicalInfo).length")
        span.text-weight-bold {{ $mt(data.technicalInfo) }}
      label-block(:label="$t('label.subjectCategories')")
        span.text-weight-bold(v-for="(s, idx) in data.subjectCategories" :key="idx") {{ $mt(s.title) }},
      label-block(:label="$t('label.notes')" v-if="data.notes?.length")
        span.text-weight-bold {{ data.notes }}
      label-block(:label="$t('label.dateAvailable')")
        span.text-weight-bold {{ data.dateAvailable }}
      label-block(:label="$t('label.dateCollected')" v-if="data.dateCollected")
        span.text-weight-bold {{ data.dateCollected }}
      label-block(:label="$t('label.dateCreated')" v-if="data.dateCreated")
        span.text-weight-bold {{ data.dateCreated }}
      label-block(:label="$t('label.funding')" v-if="data.fundingReferences?.length")
        span.text-weight-bold(v-for="(f, idx) in data.fundingReferences" :key="idx") {{ f.projectID }} ({{$mt(f.funder.title)}})
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
    :has-create="!created && !failed && !hasErrors && mode === 'create'"
    :has-save="!created && !failed && !hasErrors && mode === 'save'"
    :has-next="false"
    @create="createRecord"
    @save="saveChanges"
    @prev="$emit('prev')"
    @retry="retry")
  q-inner-loading(:showing="submitting")
    circular-spinner(:message="$t('message.submitting')")
  .text-body2.col.q-ml-sm(v-if="!failed")
    q-icon.q-pr-sm.q-py-sm(v-if="mode === 'create'" size="sm" :color="!hasErrors? 'info': 'negative'" :name="!hasErrors? 'info': 'warning'")
    span.text-caption(v-if="!hasErrors && mode === 'create'") {{ $t('message.submissionInfo') }}
    span.text-caption.text-negative(v-else-if="hasErrors") {{ $t('message.submissionHasErrors') }}
</template>
<script>
import {computed, defineComponent, reactive, ref} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import {axios} from 'boot/axios'
import CircularSpinner from 'components/ui/CircularSpinner'
import LabelBlock from 'components/record/LabelBlock'
import {PRIMARY_COMMUNITY_FIELD, TAXONOMY_TERM_DATASET, TAXONOMY_TERM_RESTRICTED} from 'src/constants'
import useAuth from 'src/composables/useAuth'
import deepcopy from "deepcopy";

export default defineComponent({
  name: 'Submission',
  components: {
    CircularSpinner,
    StepperNav,
    LabelBlock
  },
  emits: ['create', 'save', 'prev', 'retry'],
  props: {
    mode: {
      type: String,  // 'create' | 'save'
      default: 'create'
    },
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      required: true
    },
    record: Object,
  },
  setup(props, ctx) {
    const submitting = ref(false)
    const failed = ref(false)
    const error = ref(null)
    const created = ref(false)

    const {effectiveCommunity} = useAuth()
    const {notifyError, notifySuccess, submitBugReport} = useNotify()

    const submitUrl = computed(() => {
      return props.record?.value?.http?.data?.links.self
    })

    function _submissionFail(err) {
      console.log(err)
      failed.value = true
      error.value = err
      notifyError('error.submissionFail')
    }

    function _submissionSuccess(response) {
      created.value = response.data
      notifySuccess(props.mode === 'create'? 'message.submissionSuccess' : 'message.saveChangesSuccess', {pid: created.value.id})
    }

    function retry() {
      failed.value = false
      ctx.emit('retry')
    }

    function reportError() {
      submitBugReport(error.value)
      retry()
    }

    function saveChanges() {
      submitting.value = true

      let submissionData = deepcopy({
        ...props.record.value.metadata,
        ...props.data
      })

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.put(submitUrl.value, JSON.stringify(submissionData), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => {
        if (res.status === 200) {
          _submissionSuccess(res)
          ctx.emit('save', created.value)
          return
        }
        _submissionFail(res)
      }).catch(err => {
        _submissionFail(err)
      }).finally(() => {
        submitting.value = false
      })
    }

    function createRecord() {
      submitting.value = true

      // Set internal metadata fields

      // TODO: properly set primary community on metadata
      let submissionData = deepcopy(props.data)
      submissionData[PRIMARY_COMMUNITY_FIELD] = effectiveCommunity.value.id
      // AccessRights - for datasets will always be 'open access'
      submissionData['accessRights'] = TAXONOMY_TERM_RESTRICTED
      // We support datasets ResourceType only
      submissionData['resourceType'] = TAXONOMY_TERM_DATASET

      const submitUrl = `/${submissionData[PRIMARY_COMMUNITY_FIELD]}/datasets/draft/`

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.post(submitUrl, JSON.stringify(submissionData), {
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

    return {created, failed, error, createRecord, saveChanges, reportError, retry, submitting}
  }
})
</script>
<style lang="sass" scoped>
</style>
