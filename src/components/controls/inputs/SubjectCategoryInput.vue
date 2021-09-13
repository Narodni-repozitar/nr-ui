<template lang="pug">
q-field.no-margin.no-label-float.row.full-width(
  :error="error"
  :error-message="errorMessage"
  readonly
  borderless
  :label="label")
  template(v-slot:control)
    .row.full-width.no-padding.no-margin
      term-list-select.q-mt-none.no-padding.no-margin(
        ref="input"
        v-bind="$attrs"
        v-model="model.subjectCategories"
        taxonomy="subjects"
        :rules="rules"
        multiple
        readonly
        borderless
        :selector-title="`${$t('action.choose')} ${$t('label.subjectCategories').toLowerCase()}`"
        :elasticsearch="false")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useValidation from '/src/composables/useValidation'
import useInputRefs from '/src/composables/useInputRefs'
import TermListSelect from 'components/controls/selects/TermListSelect'
import deepcopy from 'deepcopy'

export default {
  name: 'SubjectCategoryInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  components: {TermListSelect},
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
    const {error, errorMessage, required, resetValidation} = useValidation()
    const {input} = useInputRefs()

    const model = ref(deepcopy(props.modelValue))

    function onChange() {
      ctx.emit('update:modelValue', model.value)
    }

    // function validate() {
    //   resetValidation()
    //
    //   if (false) {
    //     error.value = true
    //   }
    //   return error.value ? 'error.validationFail' : true
    // }

    return {
      input,
      error,
      errorMessage,
      model,
      onChange,
      required,
    }
  }
}
</script>

<style scoped>

</style>
