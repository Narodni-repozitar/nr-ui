<template lang="pug">
term-select(
  v-bind="$attrs"
  v-model="model"
  :label="label"
  taxonomy="licenses"
  multiple
  leaf-only
  :selector-title="`${$t('action.choose')} ${label.toLowerCase()}`"
  :elasticsearch="false"
  dense
  ref="input"
  :rules="rules"
  @update:model-value="onChange($event)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import TermSelect from 'components/controls/selects/TermSelect'

export default defineComponent({
  name: 'LicensesSelect',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  components: {TermSelect},
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const model = ref(props.modelValue)

    function onChange(event) {
      ctx.emit('update:modelValue', event)
    }

    return {model, onChange}
  }
})
</script>
