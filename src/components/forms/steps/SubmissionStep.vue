<template lang="pug">
q-step(
  icon="published_with_changes"
  :done="done"
  :name="DATASET_FORM_STEPS.SUBMISSION"
  :title="$t(mode === 'create'? 'label.forms.submission':  'label.forms.saveChanges')")
  submission(
    :mode="mode"
    :errors="errors"
    :has-errors="hasErrors"
    :record="record"
    ref="submission"
    :data="submissionData"
    @prev="$emit('prev')"
    @create="$emit('create', $event)"
    @save="$emit('save', $event)")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import {DATASET_FORM_STEPS} from 'src/constants'
import Submission from "components/forms/steps/Submission";

export default defineComponent({
  name: 'SubmissionStep',
  components: {Submission},
  emits: ['update:modelValue', 'create', 'prev', 'save'],
  props: {
    mode: {
      type: String,  // 'create' | 'save'
      default: 'create'
    },
    record: Object,
    done: Boolean,
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    submissionData: Object
  },
  setup(props, ctx) {
    const submission = ref(null)



    return {
      submission,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
