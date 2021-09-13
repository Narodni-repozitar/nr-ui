<template lang="pug">
.column.q-gutter-sm
  funding-input-list(
    v-model="funding.fundingReferences"
    ref="fundingReferences"
    no-roles
    :label="$t('label.funding')"
    :item-label="$t('label.funding')")
  pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {fundingReferences:funding.fundingReferences} }}
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'
import MultilingualChips from 'components/controls/inputs/MultilingualChips'
import TermListSelect from 'components/controls/selects/TermListSelect'
import SubjectCategoryInput from 'components/controls/inputs/SubjectCategoryInput'
import MultilingualEditor from 'components/controls/inputs/MultilingualEditor'
import InputList from "components/controls/inputs/InputList";
import FundingInputList from 'components/controls/inputs/FundingInputList'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'FundingInfo',
  components: {
    FundingInputList,
    InputList,
    StepperNav,
    MultilingualChips,
    MultilingualEditor,
    TermListSelect,
    SubjectCategoryInput
  },
  emits: ['update:modelValue', 'next', 'prev'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const fundingReferences = ref(null)

    const funding = reactive({...(props.modelValue || {})})

    watch(funding, () => {
      ctx.emit('update:modelValue', funding)
    })

    const onNext = () => {
      const fir = fundingReferences.value.validate()
      if (fir !== true) {
        notifyError(fir)
        return
      }

      ctx.emit('next')
    }

    return {funding, fundingReferences, required, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
