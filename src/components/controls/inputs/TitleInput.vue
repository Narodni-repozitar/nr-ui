<template lang="pug">
multilingual-input.col(
  ref="input"
  v-model="model.title"
  :rules="[required($t('error.validation.required'))]"
  :label="label"
  @update:model-value="onChange")
</template>

<script>
import {computed, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import useValidation from 'src/composables/useValidation'
import deepcopy from "deepcopy";

export default {
  name: 'TitleInput',
  emits: ['update:modelValue'],
  components: {
    MultilingualInput
  },
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      required: true
    }
  },
  setup (props, ctx) {
    const input = ref(null)
    const {required, resetValidation} = useValidation()

    const model = ref(deepcopy(props.modelValue))

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', {...model.value})
    }

    return {input, model, required, onChange}
  }
}
</script>

<style lang="sass" scoped>
</style>
