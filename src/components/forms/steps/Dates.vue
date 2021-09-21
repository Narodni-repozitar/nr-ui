<template lang="pug">
.column.q-gutter-sm.q-pt-sm
  date-input.col(
    ref="dateAvailable"
    autofocus
    v-model="model.dateAvailable"
    @update:model-value="onChange"
    :label="$t('label.dateAvailable')"
    :hint="$t('hint.publicationDate')")
  date-input.col.q-pt-lg(
    ref="dateCollected"
    range
    v-model="model.dateCollected"
    @update:model-value="onChange"
    :label="$t('label.dateCollected')")
  date-input.col(
    ref="dateCreated"
    range
    v-model="model.dateCreated"
    @update:model-value="onChange"
    :label="$t('label.dateCreated')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ model }}
  stepper-nav.q-mt-xl(has-prev @next="$emit('next')" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, ref} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'
import DateInput from 'components/controls/inputs/DateInput'
import deepcopy from 'deepcopy'
import useModel from 'src/composables/useModel'

export default defineComponent({
  name: 'Dates',
  components: {
    DateInput,
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
    const dateAvailable = ref(null)
    const dateCreated = ref(null)
    const dateCollected = ref(null)

    function validate() {
      const dar = dateAvailable.value.validate()

      if (dar !== true) {
        ctx.emit('validate', false)
      } else {
        ctx.emit('validate', true)
      }
    }

    return {model, dateAvailable, dateCreated, dateCollected, required, validate, onChange}
  }
})
</script>
<style lang="sass" scoped>
</style>
