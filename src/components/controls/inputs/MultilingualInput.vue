<template lang="pug">
q-field.no-margin.no-label-float.row.full-width.multilingual-input(
  ref="fieldRef"
  :class="[dense? 'dense': '']"
  :label="label"
  :error="error"
  readonly
  borderless
  :error-message="errorMessage"
  @focus="onFocus")
  template(v-slot:control)
    .col-grow.row.multilingual-input.q-pr-sm
      q-input.col-12.q-mr-sm.no-outline(
        stack-label
        ref="setInputRef"
        :input-class="[dense? 'dense-input': '']"
        v-for="(val, idx) in model" :key="idx"
        v-bind="$attrs"
        :rules="rules"
        v-model="model[idx].val"
        @update:model-value="onChange")
        template(v-slot:prepend="slotProps")
          q-badge.shadow-1.q-ml-sm.q-mr-xs.q-mt-md.q-pb-sm.q-pt-xs(transparent color="accent") {{ model[idx].lang }}
            q-tooltip {{ $t(`value.lang.${model[idx].lang}`) }}
          q-btn.q-mt-md.q-mr-xs(v-if="idx === model.length -1" size="sm" color="accent" dense outline icon="add"
            @click="addLangVariant")
            q-tooltip {{ $t('action.addLang') }}
          q-btn.q-mt-md.q-mr-xs(v-if="model.length > 1" size="sm" dense outline icon="remove" color="dark"
            @click="rmLangVariant(idx)")
            q-tooltip {{ $t('action.rmLang') }}
          q-separator.q-mt-lg(inset vertical)
        template(v-slot:append)

</template>
<script>
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from 'components/i18n/LocaleSelect'
import useModel from '/src/composables/useModel'
import useValidation from '/src/composables/useValidation'
import useInputRefs from 'src/composables/useInputRefs'
import useMultilingual from 'src/composables/useMultilingual'

export default {
  name: 'MultilingualInput',
  components: {LocaleSelect},
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    dense: Boolean,
    rules: Array,
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, ctx) {
    const model = ref([])
    const {setInputRef, inputRefs} = useInputRefs()
    const {addLangVariant, rmLangVariant} = useMultilingual(model, inputRefs, onChange)

    const {locale} = useI18n()
    const {error, errorMessage, resetValidation, required} = useValidation()

    const fieldRef = ref(null)

    const {isEmpty} = useModel(ctx, model)

    if (!Object.keys(props.modelValue).length) {
      model.value.push({lang: locale.value, val: ''})
    }

    function validate() {
      resetValidation()
      props.rules?.forEach(rule => {
        const res = rule(modelExternal.value)
        if (res !== true) {
          error.value = true
          errorMessage.value = res
        }
      })

      inputRefs.value.forEach(inp => {
        const res = inp.validate()
        if (res !== true) {
          error.value = true
        }
      })

      if (error.value !== true) {
        resetValidation()
        return true
      }
      return errorMessage.value
    }

    const modelExternal = computed(() => {
      let values = {}
      model.value.forEach(v => {
        if (v.lang) {
          values[v.lang] = v.val
        }
      })
      return values
    })

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    function onFocus() {
      if (isEmpty.value) {
        addLangVariant()
      }
    }

    return {
      model,
      fieldRef,
      inputRefs,
      error,
      errorMessage,
      addLangVariant,
      rmLangVariant,
      setInputRef,
      required,
      validate,
      onFocus,
      onChange
    }
  }
}
</script>

<style lang="sass">
.multilingual-input
  &.dense
    .q-field__control-container
      padding-top: 0 !important

    .dense-input
      padding-top: 24px
</style>
