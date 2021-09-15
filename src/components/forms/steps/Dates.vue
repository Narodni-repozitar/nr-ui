<template lang="pug">
.column.q-gutter-sm.q-pt-sm
  date-input.col(
    ref="dateAvailable"
    autofocus
    v-model="model.dateAvailable"
    @update:model-value="onChange"
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
            @update:model-value="onChange"
            :label="$t('label.dateCollected')")
          date-input.col(
            ref="dateCreated"
            v-model="model.dateCreated"
            @update:model-value="onChange"
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
import deepcopy from "deepcopy";
import useModel from "src/composables/useModel";

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
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx,model)

    if (!model.value.dateAvailable) {
      model.value.dateAvailable = date.formatDate(new Date(), 'YYYY-MM-DD')
      onChange()
    }

    const {notifyError} = useNotify()
    const {required} = useValidation()
    const dateAvailable = ref(null)
    const dateCreated = ref(null)
    const dateCollected = ref(null)

    const onNext = () => {
      const dar = dateAvailable.value.validate()

      if (dar !== true) {
        notifyError('error.validationFail')
      } else {
        ctx.emit('next')
      }
    }

    return {model, dateAvailable, dateCreated, dateCollected, required, onNext, onChange}
  }
})
</script>
<style lang="sass" scoped>
</style>
