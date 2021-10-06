<template lang="pug">
q-select(
  ref="input"
  v-bind="$attrs"
  standout
  square
  menu-anchor="bottom left"
  icon="flag"
  v-model="model"
  :label="$t('label.localeSwitcher')"
  :options="opts"
  :option-label="opt => opt? $t(`value.lang.${opt}`) + ` (${opt})`: `${$t('label.chooseLocale')}…`"
  :rules="rules"
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
import {defineComponent, onMounted, ref} from 'vue'
import {API_MULTILINGUAL_SUPPORTED_LANGUAGES} from 'src/constants'
import ValidateMixin from "src/mixins/ValidateMixin";

export default defineComponent({
  name: 'LocaleSelect',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    rules: Array,
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: API_MULTILINGUAL_SUPPORTED_LANGUAGES
    }
  },
  setup (props) {
    const input = ref(null)
    const model = ref(props.modelValue)
    const opts = ref(props.options)

    return {model, opts, input}
  }
})
</script>
