<template lang="pug">
q-select(
  input-class="col-auto"
  ref="input"
  outlined
  square
  color="primary"
  v-bind="$attrs"
  :label="label"
  :rules="rules"
  v-model="modelValue"
  :options="options"
  @update:model-value="$emit('update:modelValue', $event)")
  template(v-if="clearable" v-slot:append)
    cancel-button(v-if="modelValue" @click="clear" size="md")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'

export default {
  name: 'BaseSelect',
  mixins: [ValidateMixin],
  emits: ['update:modelValue', 'clear'],
  props: {
    label: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number, Array, Object],
      default: ''
    }
  },
  setup (props, ctx) {
    const input = ref(null)

    function clear() {
      ctx.emit('update:modelValue', null)
      ctx.emit('clear', null)
      input.value.focus()
    }

    return {input, clear}
  }
}
</script>

<style scoped>

</style>
