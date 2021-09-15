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
        v-model="model"
        taxonomy="subjects"
        :rules="rules"
        multiple
        readonly
        borderless
        @update:model-value="onChange"
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
import useModel from "src/composables/useModel";

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
    const model = ref(deepcopy(props.modelValue))

    const {onChange} = useModel(ctx, model)
    const {error, errorMessage, required} = useValidation()
    const {input} = useInputRefs()


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
