<template lang="pug">
q-step(
  icon="analytics"
  error-icon="analytics"
  :done="done"
  :error="error"
  :name="DATASET_FORM_STEPS.DESCRIPTION"
  :title="$t('label.forms.description')")
  dataset-description(
    ref="description"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.DESCRIPTION, $event)"
    @prev="$emit('prev')"
    @next="$emit('next')")
</template>
<script>
import {defineComponent, ref} from 'vue'
import useModel from 'src/composables/useModel'
import {DATASET_FORM_STEPS} from 'src/constants'
import deepcopy from 'deepcopy'
import DatasetDescription from 'components/forms/steps/DatasetDescription'

export default defineComponent({
  name: 'DatasetDescriptionStep',
  components: {DatasetDescription},
  emits: ['update:modelValue', 'next', 'validate', 'prev'],
  props: {
    done: Boolean,
    error: Boolean,
    modelValue: Object
  },
  setup(props, ctx) {
    const description = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (description.value) {
        return description.value.validate()
      }
    }

    return {
      model,
      description,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
