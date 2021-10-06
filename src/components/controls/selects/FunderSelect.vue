<template lang="pug">
q-field.no-label-float.row.fit(
  ref="fieldRef"
  v-bind="$attrs"
  :error="error"
  :error-message="errorMessage"
  hide-bottom-space
  borderless
  :label="label"
  readonly)
  template(v-slot:control)
    term-select.col-12.q-px-none.no-outline(
      v-model="model"
      taxonomy="funders"
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
import useValidation from 'src/composables/useValidation'
import useModel from 'src/composables/useModel'

export default defineComponent({
  name: 'FunderSelect',
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
      type: Object,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const model = ref(props.modelValue)
    const {error, errorMessage} = useValidation()
    const {onChange} = useModel(ctx, model)

    return {model, error, errorMessage, onChange}
  }
})
</script>
