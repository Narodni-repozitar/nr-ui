<template lang="pug">
q-field.no-label-float.row.fit(
  ref="fieldRef"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error-message="errorMessage"
  @focus="onFocus"
  borderless)
  template(v-slot:control)
    .col-grow.row.multilingual-input.q-pr-sm
      q-input.col-12.q-mr-sm.q-mt-md.no-outline(
        autogrow
        stack-label
        v-for="(val, idx) in model" :key="idx"
        v-bind="$attrs"
        :rules="rules"
        v-model="model[idx].val"
        @update:model-value="onChange")
        template(v-slot:prepend)
          locale-select.fit.q-pt-sm(
            hide-bottom-space
            hide-hint
            outlined
            :ref="setInputRef"
            :rules="[required($t('error.validation.required'))]"
            :options="availableLangs"
            v-model="model[idx].lang"
            new-value-mode="add-unique"
            @update:model-value="onChange")
        template(v-slot:append)
          q-btn(v-if="model.length > 1" round dense flat icon="remove" color="negative"  @click="rmLang(idx)")
            q-tooltip {{ $t('action.rmLang') }}
  template(v-slot:append)
    q-btn.q-mr-sm(v-if="availableLangs.length" round color="positive" dense flat icon="add" @click="addLang")
      q-tooltip {{ $t('action.addLang') }}
</template>
<script>
import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from 'components/i18n/LocaleSelect'
import useModel from '/src/composables/useModel'
import useValidation from '/src/composables/useValidation'
import {API_MULTILINGUAL_SUPPORTED_LANGUAGES} from "src/constants";
import useInputRefs from "src/composables/useInputRefs";

export default {
  name: 'MultilingualInput',
  components: {LocaleSelect},
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    rules: Array,
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, ctx) {
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
      props.rules.forEach(rule => {
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
      model.value = model.value.splice(idx, 1)
      onChange()
    }

    function addLang() {
      model.value.push({lang: '', val: ''})
      onChange()
    }

    const availableLangs = computed(() => {
      return API_MULTILINGUAL_SUPPORTED_LANGUAGES // TODO: .filter(ln => !model.value.map(v => v.lang).includes(ln))
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
  border-right: 2px dotted $secondary
</style>
