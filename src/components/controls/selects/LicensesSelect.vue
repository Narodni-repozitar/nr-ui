<template lang="pug">
q-field.no-label-float.row.fit(
  ref="fieldRef"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error-message="errorMessage"
  hide-bottom-space
  borderless
  readonly)
  template(v-slot:control)
    term-select.col-12.q-pl-none.q-mr-sm.q-mt-md.no-outline(
      v-model="model"
      taxonomy="licenses"
      multiple
      hide-bottom-space
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
