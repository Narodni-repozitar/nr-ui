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
  v-model="modelValue"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import useValidation from "src/composables/useValidation";

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
  setup () {
    const {resetValidation} = useValidation()
    const input = ref(null)
    return {input, resetValidation}
  }
}
</script>

<style lang="sass" scoped>
</style>
