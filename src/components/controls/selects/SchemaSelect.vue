<template lang="pug">
base-select(
  ref="input"
  v-bind="$attrs"
  :label="label"
  :rules="rules"
  v-model="model"
  options-dense
  :options="schemes"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import BaseSelect from 'components/controls/selects/BaseSelect'

export default {
  name: 'SchemaSelect',
  mixins: [ValidateMixin],
  components: {BaseSelect},
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    schemes: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [String, Number, Array],
      default: ''
    }
  },
  setup(props) {
    const input = ref(null)
    const model = ref(props.modelValue)

    return {model, input}
  }
}
</script>

<style scoped>

</style>
