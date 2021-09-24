<template lang="pug">
.column.q-gutter-sm
  funding-input-list(
    v-model="model.fundingReferences"
    ref="fundingReferences"
    no-roles
    :label="$t('label.funding')"
    @update:model-value="onChange"
    :item-label="$t('label.funding')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {fundingReferences:funding.fundingReferences} }}
  stepper-nav.q-mt-xl(has-prev @next="$emit('next')" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'
import FundingInputList from 'components/controls/inputs/FundingInputList'
import deepcopy from "deepcopy";
import useModel from "src/composables/useModel";

export default defineComponent({
  name: 'FundingInfo',
  components: {
    FundingInputList,
    StepperNav,
  },
  emits: ['update:modelValue', 'next', 'prev', 'validate'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const model = ref(deepcopy(props.modelValue))

    const {onChange} = useModel(ctx, model)
    const {required} = useValidation()
    const fundingReferences = ref(null)

    function validate() {
      const fir = fundingReferences.value.validate()
      if (fir !== true) {
        ctx.emit('validate', false)
        return
      }

      ctx.emit('validate', true)
    }

    return {model, fundingReferences, onChange, required, validate}
  }
})
</script>
<style lang="sass" scoped>
</style>
