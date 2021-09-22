<template lang="pug">
q-step(
  icon="published_with_changes"
  :done="done"
  :name="DATASET_FORM_STEPS.SUBMISSION"
  :title="$t('label.forms.submission')")
  submission(
    :errors="errors"
    :has-errors="hasErrors"
    ref="submission"
    :data="submissionData"
    @prev="$emit('prev')"
    @create="$emit('create', $event)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import {DATASET_FORM_STEPS} from 'src/constants'
import Submission from "components/forms/steps/Submission";

export default defineComponent({
  name: 'SubmissionStep',
  components: {Submission},
  emits: ['update:modelValue', 'create', 'prev'],
  props: {
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
