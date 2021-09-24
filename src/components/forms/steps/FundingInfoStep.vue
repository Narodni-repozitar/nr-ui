<template lang="pug">
q-step(
  icon="euro_symbol"
  error-icon="euro_symbol"
  :done="done"
  :error="error"
  :name="DATASET_FORM_STEPS.FUNDING"
  :title="$t('label.forms.funding')")
  funding-info(
    ref="input"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.FUNDING, $event)"
    @prev="$emit('prev')"
    @next="$emit('next')")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
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
    const input = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (input.value) {
        return input.value.validate()
      }
    }

    const visited = computed(() => {
      return input.value
    })

    return {
      model,
      input,
      visited,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
