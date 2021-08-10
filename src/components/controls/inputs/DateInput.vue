<template lang="pug">
q-input(
  ref="input"
  outlined
  square
  color="primary"
  :rules="[edtf0Rule]"
  v-bind="$attrs"
  :label="label"
  v-model="modelValue"
  @update:model-value="$emit('update:modelValue', $event)")
  template(v-slot:append)
    q-icon(name="event" class="cursor-pointer")
    q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
      q-date(flat v-model="modelValue" mask="YYYY-MM-DD")
        .row.items-center.justify-end
          q-btn(v-close-popup :label="$t('action.close')" color="primary" flat)
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useDate from '/src/composables/useDate'

export default {
  name: 'DateInput',
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
    const {edtf0Mask, edtf0Rule} = useDate()

    const input = ref(null)
    return {input, edtf0Mask, edtf0Rule}
  }
}
</script>

<style scoped>

</style>
