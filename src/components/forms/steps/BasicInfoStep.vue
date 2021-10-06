<template lang="pug">
q-step(
  icon="info"
  :done="done"
  :error="error"
  error-icon="info"
  :name="DATASET_FORM_STEPS.BASIC"
  :title="$t('label.forms.basic')")
  basic-info(
    ref="input"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.BASIC, $event)"
    @next="$emit('next')")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import useModel from 'src/composables/useModel'
import {DATASET_FORM_STEPS} from 'src/constants'
import deepcopy from 'deepcopy'
import BasicInfo from 'components/forms/steps/BasicInfo'

export default defineComponent({
  name: 'BasicInfoStep',
  components: {BasicInfo},
  emits: ['update:modelValue', 'next', 'validate'],
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
