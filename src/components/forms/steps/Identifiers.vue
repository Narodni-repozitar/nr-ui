<template lang="pug">
.column
  identifier-input-list(
    v-model="model.identifiers"
    ref="input"
    :schemes="RESOURCE_IDENTIFIER_SCHEMES"
    :label="$t('label.identifiers')"
    :item-label="$t('label.identifier')")
  stepper-nav(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import {RESOURCE_IDENTIFIER_SCHEMES} from 'src/constants'
import IdentifierInputList from 'components/controls/inputs/IdentifierInputList'

export default defineComponent({
  name: 'Identifiers',
  components: {IdentifierInputList, StepperNav},
  emits: ['update:modelValue', 'prev', 'next'],
  props: {
    modelValue: Object
  },
  setup (props, ctx) {
    const {notifyError} = useNotify()

    const model = reactive(props.modelValue || {identifiers: []})
    const input = ref(null)

    watch (model, () => {
      ctx.emit('update:modelValue', model)
    })

    function onNext () {
      const res = input.value.validate()

      if (res !== true) {
        notifyError(res)
        return
      }

      ctx.emit('next')
    }

    return {model, input, onNext, RESOURCE_IDENTIFIER_SCHEMES}
  }
})
</script>
<style lang="sass" scoped>
</style>
