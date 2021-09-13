<template lang="pug">
.column.q-gutter-sm

  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {fundingReferences:funding.fundingReferences} }}
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'

export default defineComponent({
  name: 'FundingInfo',
  components: {
    StepperNav,
  },
  emits: ['update:modelValue', 'next', 'prev'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()

    const model = reactive({...(props.modelValue || {})})

    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    const onNext = () => {
      ctx.emit('next')
    }

    return {model, required, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
