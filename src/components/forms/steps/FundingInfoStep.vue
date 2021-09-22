<template lang="pug">
q-step(
  icon="euro_symbol"
  error-icon="euro_symbol"
  :done="done"
  :error="error"
  :name="DATASET_FORM_STEPS.FUNDING"
  :title="$t('label.forms.funding')")
  funding-info(
    ref="funding"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.FUNDING, $event)"
    @prev="$emit('prev')"
    @next="$emit('next')")
</template>
<script>
import {defineComponent, ref} from 'vue'
import useModel from 'src/composables/useModel'
import {DATASET_FORM_STEPS} from 'src/constants'
import deepcopy from 'deepcopy'
import FundingInfo from "components/forms/steps/FundingInfo";

export default defineComponent({
  name: 'FundingInfoStep',
  components: {FundingInfo},
  emits: ['update:modelValue', 'next', 'validate', 'prev'],
  props: {
    done: Boolean,
    error: Boolean,
    modelValue: Object
  },
  setup(props, ctx) {
    const funding = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (funding.value) {
        return funding.value.validate()
      }
    }

    return {
      model,
      funding,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
