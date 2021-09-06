<template lang="pug">
q-field.no-margin.no-label-float.row.full-width.multilingual-input(
  ref="fieldRef"
  v-bind="$attrs"
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
          q-badge.q-ml-sm.q-mt-md.q-pb-sm.q-pt-xs(transparent color="accent") {{ model[idx].lang }}
            q-tooltip {{ $t(`value.lang.${model[idx].lang}`) }}
        template(v-slot:append)
          q-btn.q-mr-sm(v-if="model.length > 1" round dense flat icon="remove" color="negative"  @click="rmLang(idx)")
            q-tooltip {{ $t('action.rmLang') }}
          q-btn.q-mr-sm(v-if="idx === model.length -1" round color="positive" dense flat icon="add" @click="addLang")
            q-tooltip {{ $t('action.addLang') }}
</template>
<script>
import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from 'components/i18n/LocaleSelect'
import useModel from '/src/composables/useModel'
import useValidation from '/src/composables/useValidation'
import {API_MULTILINGUAL_SUPPORTED_LANGUAGES} from 'src/constants'
import useInputRefs from 'src/composables/useInputRefs'
import {useQuasar} from 'quasar'

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
    const $q = useQuasar()
    const {t, locale} = useI18n()
    const {setInputRef, inputRefs} = useInputRefs()
    const {error, errorMessage, resetValidation, required} = useValidation()

    const fieldRef = ref(null)

    const model = ref([])
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

    function rmLang(idx) {
      model.value.splice(idx, 1)
      inputRefs.value.splice(idx, 1)
      onChange()
    }

    function addLang() {
      $q.dialog({
        title: t('label.language'),
        message: `${t('action.choose')} ${t('label.language')}`,
        options: {
          type: 'radio',
          model: 'lang',
          // inline: true
          items: availableLangs.value.map(l => {return {label: t(`value.lang.${l}`), value: l}})
        },
        cancel: true,
        persistent: false
      }).onOk(data => {
        model.value.push({lang: data, val: ''})
        onChange()
      })
    }

    const availableLangs = computed(() => {
      return API_MULTILINGUAL_SUPPORTED_LANGUAGES.filter(ln => !model.value.map(v => v.lang).includes(ln))
    })

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
        addLang()
      }
    }

    return {
      model,
      fieldRef,
      inputRefs,
      error,
      errorMessage,
      availableLangs,
      setInputRef,
      required,
      validate,
      onFocus,
      onChange,
      addLang,
      rmLang
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
