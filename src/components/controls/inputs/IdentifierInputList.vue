<template lang="pug">
q-field.fit.row(
  :filled="isEmpty"
  ref="input"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error_message="errorMessage"
  @focus="onFocus"
  borderless)
  template(v-slot:control)
    q-list.q-px-md.full-width(dense)
      q-item.no-padding.no-margin.full-width(v-for="(val,idx) in model" :key="idx")
        q-item-section.no-padding.no-margin
          identifier-input.no-padding.no-margin(
            :label="`${itemLabel} #${idx + 1}`"
            v-model="model[idx]"
            :schemes="schemes"
            :ref="setInputRef"
            @update:model-value="onChange")
        q-item-section(side)
          rm-list-item-btn(:item-label="$t('label.identifier')" @remove="rmItem(idx)")
    add-list-item-btn(:item-label="$t('label.identifier')" @add="addItem")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useInputRefs from '/src/composables/useInputRefs'
import useValidation from '/src/composables/useValidation'
import ListInputButtons from 'components/controls/buttons/ListInputButtons'
import useModel from '/src/composables/useModel'
import IdentifierInput from 'components/controls/inputs/IdentifierInput'
import RmListItemBtn from 'components/controls/buttons/RmListItemBtn'
import AddListItemBtn from 'components/controls/buttons/AddListItemBtn'

export default {
  name: 'IdentifierInputList',
  emits: ['update:modelValue'],
  components: {ListInputButtons, IdentifierInput, AddListItemBtn, RmListItemBtn},
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
      model.value.push(reactive({scheme: '', identifier: ''}))
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
      validate,
      resetValidation
    }
  }
}
</script>

<style scoped>

</style>
