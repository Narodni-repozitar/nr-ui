<template lang="pug">
multilingual-input.col(
  ref="input"
  v-model="modelValue[0].title"
  :rules="[required($t('error.validation.required'))]"
  :label="label"
  @update:model-value="onChange")
</template>

<script>
import {computed, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import useValidation from 'src/composables/useValidation'

export default {
  name: 'TitleInput',
  emits: ['update:modelValue'],
  components: {
    MultilingualInput
  },
  mixins: [ValidateMixin],
  props: {
    titleType: {
      type: String,
      enum: ['mainTitle', 'alternativeTitle', 'subtitle', 'other'],
      default: 'mainTitle'
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Array,
      default: () => [{'title': {}, 'titleType': ''}]
    }
  },
  setup (props, ctx) {
    const input = ref(null)
    const {required, resetValidation} = useValidation()


    const modelExternal = computed(() => {
      return [{...props.modelValue[0], ...{titleType: props.titleType}}]
    })

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    return {input, required, onChange}
  }
}
</script>

<style lang="sass" scoped>
</style>
