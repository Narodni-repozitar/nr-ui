<template lang="pug">
.column.q-gutter-sm
  multilingual-chips.col(
    ref="keywords"
    v-model="description.keywords"
    :label="$t('label.forms.keywords')")
  pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {keywords:description.keywords} }}
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import useNotify from 'src/composables/useNotify'
import StepperNav from 'components/controls/StepperNav'
import MultilingualChips from 'components/controls/inputs/MultilingualChips'

export default defineComponent({
  name: 'DatasetDescription',
  components: {
    StepperNav,
    MultilingualChips
  },
  emits: ['update:modelValue', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const keywords = ref(null)

    const description = reactive({...(props.modelValue || {})})

    watch(description, () => {
      ctx.emit('update:modelValue', description)
    })

    const onNext = () => {

      if (true) {
        notifyError('error.validationFail')
      } else {
        ctx.emit('next')
      }
    }

    return {description, required, keywords, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
