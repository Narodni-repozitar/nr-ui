<template lang="pug">
q-field.row(
  :filled="isEmpty"
  ref="input"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error_message="errorMessage"
  @focus="onFocus"
  readonly
  borderless)
  template(v-slot:control)
    q-list.full-width.q-pt-md.q-pl-md(dense separator padding)
      q-item.full-width.no-margin.no-padding(v-for="(val,idx) in model" :key="idx")
        q-item-section.no-padding.no-margin
          funding-input.no-padding.no-margin(
            :label="`${itemLabel} #${val.projectID? val.projectID : idx + 1}`"
            v-model="model[idx]"
            :rules="rules"
            :ref="setInputRef"
            @update:model-value="onChange")
        q-item-section(side)
          q-separator.full-height.q-mr-sm.ti-line-dotted(vertical inset)
          rm-list-item-btn(:item-label="$t('label.funding')" @remove="rmItem(idx)")
    add-list-item-btn(:item-label="$t('label.funding')" @add="addItem")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useInputRefs from '/src/composables/useInputRefs'
import useValidation from '/src/composables/useValidation'
import ListInputButtons from 'components/controls/buttons/ListInputButtons'
import useModel from '/src/composables/useModel'
import {DEFAULT_FUNDING_ITEM} from 'src/constants'
import AddListItemBtn from 'components/controls/buttons/AddListItemBtn'
import RmListItemBtn from 'components/controls/buttons/RmListItemBtn'
import deepcopy from 'deepcopy'
import FundingInput from 'components/controls/inputs/FundingInput'


export default {
  name: 'FundingInputList',
  emits: ['update:modelValue'],
  components: {RmListItemBtn, AddListItemBtn, ListInputButtons, FundingInput},
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
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
    const model = ref(deepcopy(props.modelValue))

    const {input, inputRefs, setInputRef} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const {isEmpty, onChange} = useModel(ctx, model)

    function addItem() {
      resetValidation()
      model.value.push(deepcopy(DEFAULT_FUNDING_ITEM))
      onChange()
    }

    function rmItem() {
      model.value.splice(model.value.length - 1, 1)
      onChange()
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
          errorMessage.value = res
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
