<template lang="pug">
.column.q-gutter-sm.q-pt-sm
  date-input.col(
    ref="dateAvailable"
    v-model="model.dateAvailable"
    :rules="[required($t('error.validation.required'))]"
    :label="`${$t('label.dateAvailable')} *`"
    :hint="$t('hint.publicationDate')")
  q-expansion-item.q-ml-none.q-pl-none.q-mt-xl(
    switch-toggle-side
    :label="$t('section.otherDateInfo')")
    q-card
      q-card-section
        .column
          date-input.col(
            ref="dateCollected"
            range
            v-model="model.dateCollected"
            :label="$t('label.dateCollected')")
          date-input.col(
            ref="dateCreated"
            v-model="model.dateCreated"
            :label="$t('label.dateCreated')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ model }}
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import StepperNav from 'components/controls/StepperNav'
import DateInput from 'components/controls/inputs/DateInput'
import useNotify from 'src/composables/useNotify'
import {date} from 'quasar'

export default defineComponent({
  name: 'Dates',
  components: {
    DateInput,
    StepperNav,
  },
  emits: ['update:modelValue', 'next', 'prev'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const model = reactive({...(props.modelValue || {})})

    if (!model.dateAvailable) {
      model.dateAvailable = date.formatDate(new Date(), 'YYYY-MM-DD')
    }

    const {notifyError} = useNotify()
    const {required} = useValidation()
    const dateAvailable = ref(null)
    const dateCreated = ref(null)
    const dateCollected = ref(null)

    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    const onNext = () => {
      const dar = dateAvailable.value.validate()

      if (dar !== true) {
        notifyError('error.validationFail')
      } else {
        ctx.emit('next')
      }
    }

    return {model, dateAvailable, dateCreated, dateCollected, required, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
