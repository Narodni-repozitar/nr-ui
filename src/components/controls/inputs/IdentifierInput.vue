<template lang="pug">
q-field.fit(
  ref="input"
  :error="error"
  stack-label
  square
  readonly
  borderless
  :label="label")
  template(v-slot:control)
    .row.no-padding.no-wrap.full-width
      schema-select.col-3.q-mr-sm(
        ref="scheme"
        :schemes="schemes"
        v-model="model.scheme"
        :label="$t('label.scheme') + ' *'"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="onChange")
      base-input.col-grow(
        autogrow
        ref="identifier"
        :rules="rules || [required($t('error.validation.required'))]"
        v-bind="$attrs"
        :label="$t('label.identifier') + ' *'"
        v-model="model.identifier"
        @update:model-value="onChange")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useValidation from '/src/composables/useValidation'
import useInputRefs from '/src/composables/useInputRefs'
import BaseInput from 'components/controls/inputs/BaseInput'
import SchemaSelect from 'components/controls/selects/SchemaSelect'

export default {
  name: 'IdentifierInput',
  emits: ['update:modelValue'],
  components: {BaseInput, SchemaSelect},
  mixins: [ValidateMixin],
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
      type: Object,
      default: () => { return {scheme: '', identifier: ''} }
    }
  },
  setup (props, ctx) {
    const {error, required, resetValidation} = useValidation()
    const {input} = useInputRefs()

    const scheme = ref(null)
    const identifier = ref(null)
    const model = reactive(props.modelValue)

    function onChange () {
      ctx.emit('update:modelValue', model)
      resetValidation()
    }

    function validate () {
      console.log('validate')
      scheme.value.validate()
      identifier.value.validate()

      if (scheme.value.hasError || identifier.value.hasError) {
        error.value = true
      }
      return error.value? 'error.validationFail' : true
    }

    return {input, scheme, identifier, error, model, validate, onChange, required}
  }
}
</script>

<style scoped>

</style>
