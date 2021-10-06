<template lang="pug">
base-select(
  ref="input"
  hide-hint
  hide-bottom-space
  v-bind="$attrs"
  :label="$t('label.authorType')"
  :rules="rules"
  v-model="model"
  :options="Object.values(AUTHOR_TYPES)"
  :option-label="opt => opt? $t(`value.authorType.${opt}`): `${$t('label.chooseAuthorType')}…`"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import {AUTHOR_TYPES} from '/src/constants'
import BaseSelect from 'components/controls/selects/BaseSelect'
import useValidation from 'src/composables/useValidation'

export default {
  name: 'AuthorTypeSelect',
  components: {BaseSelect},
  mixins: [ValidateMixin],
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: AUTHOR_TYPES.PERSON
    }
  },
  setup(props) {
    const input = ref(null)
    const model = ref(props.modelValue)
    const {resetValidation} = useValidation()

    return {model, input, AUTHOR_TYPES, resetValidation}
  }
}
</script>

<style scoped>

</style>
