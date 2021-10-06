<template lang="pug">
q-field.no-label-float(
  :filled="isEmpty"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :stack-label=false
  @focus.prevent="onFocus"
  :error_message="errorMessage"
  borderless
  readonly
  square)
  template(v-slot:control)
    q-list.full-width(dense)
      q-item.q-pl-md.full-width(v-for="(val,idx) in model" :key="idx")
        q-item-section
          q-input.q-pt-sm(
            :label="`${itemLabel} #${idx + 1}`"
            :rules="rules"
            :ref="setInputRef"
            v-model="model[idx]"
            @update:model-value="onChange")
        q-item-section(side)
          q-separator.full-height.q-mr-sm.ti-line-dotted(vertical inset)
          rm-list-item-btn(
            :item-label="$t('label.note')"
            @remove="rmItem(idx)")
    add-list-item-btn.q-mt-sm(:item-label="$t('label.note')" @add="addItem")
</template>

<script>
import {defineComponent, reactive, ref} from 'vue'
import useValidation from '/src/composables/useValidation'
import useInputRefs from '/src/composables/useInputRefs'
import useModel from '/src/composables/useModel'
import deepcopy from 'deepcopy'
import AddListItemBtn from 'components/controls/buttons/AddListItemBtn'
import RmListItemBtn from 'components/controls/buttons/RmListItemBtn'


export default defineComponent({
  name: 'InputList',
  components: {AddListItemBtn, RmListItemBtn},
  emits: ['update:modelValue'],
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    itemLabel: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: ''
    },
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const {setInputRef, inputRefs} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const model = ref(deepcopy(props.modelValue) || [])
    const {onChange, isEmpty} = useModel(ctx, model)

    function validate() {
      // TODO: implement validation
      return true
    }

    function addItem() {
      model.value.push('')
    }

    function onFocus() {
      if (isEmpty.value) {
        addItem()
      }
    }

    function rmItem() {
      model.value.splice(model.value.length - 1, 1)
    }

    return {
      model,
      inputRefs,
      error,
      errorMessage,
      setInputRef,
      addItem,
      rmItem,
      validate,
      onChange,
      onFocus,
      isEmpty,
      resetValidation
    }
  }
})
</script>

<style lang="sass">

</style>
