<template lang="pug">
q-field.no-label-float.row.fit(
  ref="fieldRef"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error-message="errorMessage"
  borderless
  hide-bottom-space
  readonly)
  template(v-slot:control)
    term-select.col-12.q-pl-none.q-mr-sm.q-mt-md.no-outline(
      v-model="model"
      dense
      hide-bottom-space
      ref="input"
      taxonomy="institutions"
      :selector-title="`${label.toLowerCase()}`"
      multiple
      :elasticsearch="false"
      :rules="rules"
      @update:model-value="onChange($event)")
</template>
<script>
import {defineComponent, onMounted, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import TermSelect from 'components/controls/selects/TermSelect'
import useValidation from 'src/composables/useValidation'

export default defineComponent({
  name: 'PublishersSelect',
  emits: ['update:modelValue'],
  components: {TermSelect},
  mixins: [ValidateMixin],
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
    const input = ref(null)
    const model = ref(props.modelValue)
    const {error, errorMessage, resetValidation, required} = useValidation()

    onMounted(() => {
      input.value.resetValidation()
    })

    function onChange(event) {
      ctx.emit('update:modelValue', event)
    }

    return {input, model, onChange, error, errorMessage}
  }
})
</script>
