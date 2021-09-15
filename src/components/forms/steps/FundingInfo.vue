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
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'
import FundingInputList from 'components/controls/inputs/FundingInputList'
import useNotify from 'src/composables/useNotify'
import deepcopy from "deepcopy";
import useModel from "src/composables/useModel";

export default defineComponent({
  name: 'FundingInfo',
  components: {
    FundingInputList,
    StepperNav,
  },
  emits: ['update:modelValue', 'next', 'prev'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const model = reactive(deepcopy(props.modelValue))

    const {onChange} = useModel(ctx, model)
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const fundingReferences = ref(null)


    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    const onNext = () => {
      const fir = fundingReferences.value.validate()
      if (fir !== true) {
        notifyError(fir)
        return
      }

      ctx.emit('next')
    }

    return {model, fundingReferences, onChange, required, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
