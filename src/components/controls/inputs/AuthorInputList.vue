<template lang="pug">
q-field.row(
  :filled="isEmpty"
  ref="input"
  v-bind="$attrs"
  :label="isEmpty? label: ''"
  :error="error"
  :error_message="errorMessage"
  @focus="onFocus"
  borderless)
  q-list(dense separator).full-width.no-padding.no-margin
    q-item.full-width.no-margin.no-padding(v-for="(val,idx) in model" :key="idx")
      q-item-section.no-padding.no-margin
        author-input(
          :no-roles="noRoles"
          :label="`${itemLabel} #${idx + 1}`"
          v-model="model[idx]"
          :ref="setInputRef"
          @update:model-value="onChange")
  template(v-if="model.length > 0" v-slot:append)
    list-input-buttons(@add="addItem" @remove="rmItem" can-remove)
  template(v-else v-slot:prepend)
    list-input-buttons(@add="addItem" @remove="rmItem")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useInputRefs from '/src/composables/useInputRefs'
import useValidation from '/src/composables/useValidation'
import ListInputButtons from 'components/controls/buttons/ListInputButtons'
import useModel from '/src/composables/useModel'
import AuthorInput from 'components/controls/inputs/AuthorInput'

export default {
  name: 'AuthorInputList',
  emits: ['update:modelValue'],
  components: {ListInputButtons, AuthorInput},
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    noRoles: {
      type: Boolean,
      default: false
    },
    itemLabel: {
      type: String,
      default: '',
    },
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const {input, inputRefs, setInputRef} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const model = ref([...props.modelValue] || [])
    const {isEmpty, onChange} = useModel(ctx, model)

    function addItem() {
      model.value.push(reactive({
        person_or_org: {
          name: '',
          type: 'personal',
          given_name: '',
          family_name: '',
          identifiers: []
        }, role: [], affiliations: []
      }))
    }

    function rmItem() {
      model.value.splice(model.value.length - 1, 1)
    }

    function onFocus() {
      if (isEmpty.value) {
        addItem()
      }
    }

    function validate() {
      resetValidation()
      inputRefs.value.forEach(inp => {
        const res = inp.validate()
        if (res !== true) {
          error.value = true
        }
      })
      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      inputRefs,
      setInputRef,
      model,
      error,
      errorMessage,
      addItem,
      rmItem,
      onChange,
      onFocus,
      isEmpty,
      validate
    }
  }
}
</script>

<style scoped>

</style>
