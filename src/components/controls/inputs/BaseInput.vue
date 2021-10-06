<template lang="pug">
q-input(
  outlined
  square
  item-aligned
  color="primary"
  ref="input"
  :rules="rules"
  v-bind="$attrs"
  :label="label"
  v-model="model"
  @update:model-value="onChange")
  template(v-slot:append)
    cancel-button.self-center(v-if="model?.length" @click="clear" size="md")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import useValidation from 'src/composables/useValidation'
import deepcopy from 'deepcopy'
import useModel from 'src/composables/useModel'

export default {
  name: 'BaseInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, ctx) {
    const model = ref(deepcopy(props.modelValue))

    const {onChange} = useModel(ctx, model)
    const {resetValidation} = useValidation()
    const input = ref(null)

    function clear() {
      model.value = ''
      onChange()
    }

    return {input, resetValidation, model, onChange, clear}
  }
}
</script>

<style lang="sass" scoped>
</style>
