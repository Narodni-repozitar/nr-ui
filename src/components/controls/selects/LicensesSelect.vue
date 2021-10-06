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
      hide-bottom-space
      leaf-only
      :exclude="exclude"
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
import useValidation from "src/composables/useValidation";
import deepcopy from "deepcopy";

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
    exclude: Array,
    modelValue: {
      type: [Object, Array],
      default: () => {}
    }
  },
  setup(props, ctx) {
    const model = ref({})
    const {error, errorMessage} = useValidation()

    if (Array.isArray(props.modelValue)) {
      model.value = props.modelValue.filter(t => !t.is_ancestor)[0] || {}
    } else {
      model.value = deepcopy(props.modelValue)
    }

    function onChange(event) {
      ctx.emit('update:modelValue', event)
    }

    return {model, error, errorMessage, onChange}
  }
})
</script>
