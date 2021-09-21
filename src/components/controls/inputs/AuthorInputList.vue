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
          author-input.no-padding.no-margin(
            :no-roles="noRoles"
            :label="`${itemLabel} #${idx + 1}`"
            v-model="model[idx]"
            :rules="rules"
            :split-name="splitName"
            :ref="setInputRef"
            @update:model-value="onChange")
        q-item-section(side)
          q-separator.full-height.q-mr-sm.ti-line-dotted(vertical inset)
          rm-list-item-btn(:item-label="addItemLabel" @remove="rmItem(idx)")
    add-list-item-btn(:item-label="addItemLabel" @add="addItem")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useInputRefs from '/src/composables/useInputRefs'
import useValidation from '/src/composables/useValidation'
import ListInputButtons from 'components/controls/buttons/ListInputButtons'
import useModel from '/src/composables/useModel'
import AuthorInput from 'components/controls/inputs/AuthorInput'
import {DEFAULT_AUTHOR_ITEM} from 'src/constants'
import AddListItemBtn from 'components/controls/buttons/AddListItemBtn'
import RmListItemBtn from 'components/controls/buttons/RmListItemBtn'
import deepcopy from "deepcopy";


export default {
  name: 'AuthorInputList',
  emits: ['update:modelValue'],
  components: {RmListItemBtn, AddListItemBtn, ListInputButtons, AuthorInput},
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
    addItemLabel: {
      type: String,
      default: ''
    },
    splitName: Boolean,
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const {input, inputRefs, setInputRef} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const model = ref(props.modelValue.length? deepcopy(props.modelValue) : [])
    const {isEmpty, onChange} = useModel(ctx, model)

    function addItem() {
      resetValidation()
      model.value.push(deepcopy(DEFAULT_AUTHOR_ITEM))
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
