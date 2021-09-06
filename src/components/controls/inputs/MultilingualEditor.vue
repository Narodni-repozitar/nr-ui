<template lang="pug">
q-field.no-label-float.row.multilingual-input(
  ref="fieldRef"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error-message="errorMessage"
  @focus="onFocus"
  readonly
  borderless)
  template(v-slot:control)
    .col-grow.row.full-width.multilingual-input.q-pr-sm.q-mt-lg.q-gutter-sm
      .col-12.row.no-outline(v-for="(val, idx) in model" :key="idx")
        q-editor.full-width(
          :ref="setInputRef"
          toolbar-outline
          hide-bottom-space
          v-model="model[idx].val"
          :definitions="definitions"
          :toolbar="toolbar"
          @update:model-value="onChange")
          template(v-slot:lang)
            q-badge.q-pb-sm.q-pt-xs.q-mb-xs.q-mr-xs.shadow-1(transparent color="accent") {{ model[idx].lang }}
              q-tooltip {{ $t(`value.lang.${model[idx].lang}`) }}
</template>

<script>
import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from 'components/i18n/LocaleSelect'
import useValidation from '/src/composables/useValidation'
import useModel from '/src/composables/useModel'
import useInputRefs from '/src/composables/useInputRefs'
import useMultilingual from 'src/composables/useMultilingual'

export default {
  name: 'MultilingualEditor',
  components: {LocaleSelect},
  emits: ['update:modelValue'],
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    rules: Array,
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, ctx) {
    const model = ref([])

    const {t, locale} = useI18n()
    const {error, required, errorMessage, resetValidation} = useValidation()
    const {setInputRef, inputRefs} = useInputRefs()
    const {isEmpty} = useModel(ctx, model)
    const {addLangVariant, rmLangVariant} = useMultilingual(model, inputRefs, onChange)
    const definitions = ref({
      addLang: {
        tip: t('action.addLang'),
        icon: 'add',
        handler: addLangVariant
      },
      rmLang: {
        tip: t('action.rmLang'),
        icon: 'remove',
        handler: rmLangVariant
      }
    })
    const toolbar = computed(() => {
      const langGroup = ['lang', 'addLang']
      if (!isEmpty.value && model.value.length > 1) {
        langGroup.push('rmLang')
      }
      console.log(langGroup, model.value)
      return [
        langGroup,
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo']
      ]
    })

    const fieldRef = ref(null)

    if (!Object.keys(props.modelValue).length && !props.empty) {
      model.value.push(reactive({lang: locale.value, val: ''}))
    } else {
      Object.keys(props.modelValue).forEach(l => {
        model.value.push(reactive({lang: l, val: props.modelValue[l]}))
      })
    }

    function validate() {
      resetValidation()
      props.rules.forEach(rule => {
        const res = rule(modelExternal.value)
        if (res !== true) {
          error.value = true
          errorMessage.value = res
        }
      })

      if (error.value !== true) {
        resetValidation()
        return true
      }
      return errorMessage.value
    }

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    function onFocus() {
      if (isEmpty.value) {
        addLangVariant()
      }
    }

    const modelExternal = computed(() => {
      let values = {}
      model.value.forEach(v => {
        values[v.lang] = v.val !== '<br>' ? v.val : ''
      })
      return values
    })

    return {
      model,
      toolbar,
      definitions,
      fieldRef,
      inputRefs,
      setInputRef,
      modelExternal,
      validate,
      error,
      required,
      errorMessage,
      resetValidation,
      onChange,
      onFocus,
      addLangVariant,
      rmLangVariant,
      isEmpty
    }
  }
}
</script>

<style lang="sass">

</style>
