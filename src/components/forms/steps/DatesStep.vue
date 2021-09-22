<template lang="pug">
q-step(
  icon="date_range"
  error-icon="date_range"
  :done="done"
  :error="error"
  :name="DATASET_FORM_STEPS.DATES"
  :title="$t('label.forms.dates')")
  dates(
    ref="dates"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.DATES, $event)"
    @prev="$emit('prev')"
    @next="$emit('next')")
</template>
<script>
import {defineComponent, ref} from 'vue'
import useModel from 'src/composables/useModel'
import {DATASET_FORM_STEPS} from 'src/constants'
import deepcopy from 'deepcopy'
import Dates from 'components/forms/steps/Dates'

export default defineComponent({
  name: 'DatesStep',
  components: {Dates},
  emits: ['update:modelValue', 'next', 'validate', 'prev'],
  props: {
    done: Boolean,
    error: Boolean,
    modelValue: Object
  },
  setup(props, ctx) {
    const dates = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (dates.value) {
        return dates.value.validate()
      }
    }

    return {
      model,
      dates,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
