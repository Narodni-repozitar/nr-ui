<template lang="pug">
q-select(
  v-bind="$attrs"
  standout
  menu-anchor="bottom left"
  icon="flag"
  v-model="model"
  :label="$t('label.localeSwitcher')"
  :option-label="opt => opt? $t(`value.lang.${opt}`) + ` (${opt})`: `${$t('label.chooseLocale')}…`"
  dense
  options-cover
  emit-value
  hide-bottom-space
  hide-hint
  stack-label
  map-options
  options-dense
  @update:model-value="$emit('update:modelValue', $event)")
</template>
<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'LocaleSelect',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props) {
    const model = ref(props.modelValue)
    return {model}
  }
})
</script>
