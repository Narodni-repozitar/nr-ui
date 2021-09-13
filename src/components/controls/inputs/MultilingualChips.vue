<template lang="pug">
q-field.no-margin.no-label-float.row.full-width.multilingual-input(
  ref="fieldRef"
  :class="[dense? 'dense': '']"
  :label="label"
  :error="error"
  readonly
  borderless
  :error-message="errorMessage")
  template(v-slot:control)
    .col-grow.row.multilingual-input.q-pr-sm
      q-select.col-12.q-mr-sm.no-outline.no-padding.no-margin(
        use-chips
        flat
        v-model="model"
        borderless
        readonly
        hide-dropdown-icon)
        template(v-slot:selected)
          q-select.no-padding.no-margin(
            @update:model-value="onChange"
            v-model="model"
            use-chips
            flat
            multiple
            readonly
            hide-dropdown-icon)
            template(v-slot:selected-item="scope")
              q-chip.q-mx-xs(
                square
                removable
                outline
                dense
                size="md"
                @remove="rmKeyword(scope)"
                :tabindex="scope.tabindex"
                color="secondary"
                text-color="dark"
                class="q-ma-none")
                q-avatar(color="accent" text-color="white" :icon="scope.opt.icon") {{ keywordData(scope.opt).lang }}
                  q-tooltip {{ $t(`value.lang.${keywordData(scope.opt).lang}`) }}
                span.text-dark.q-px-sm {{ keywordData(scope.opt).label }}
                  q-tooltip(v-if="keywordData(scope.opt).other.length")
                    .full-width(v-for="([l, v]) in keywordData(scope.opt).other")
                      .span.text-weight-bold {{ $t(`value.lang.${l}`) }}
                      .span {{ v }}
          q-btn.q-ml-xs.q-mt-md.q-mr-xs(
            size="sm"
            color="accent"
            dense outline icon="add"
            @click="addKeyword")
            q-tooltip {{ $t('action.add') }}

</template>
<script>
import {ref} from 'vue'
import LocaleSelect from 'components/i18n/LocaleSelect'
import useValidation from '/src/composables/useValidation'
import MultilingualDialog from 'src/components/dialogs/MultilingualDialog'
import ChipsSelect from 'components/controls/selects/ChipsSelect'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import BaseSelect from 'components/controls/selects/BaseSelect'
import {useTranslated} from 'src/composables/useTranslated'

export default {
  name: 'MultilingualChips',
  components: {ChipsSelect, LocaleSelect, BaseSelect},
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    dense: Boolean,
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const model = ref([])
    const {t, locale} = useI18n()
    const {mt, mtr} = useTranslated(locale)
    const $q = useQuasar()

    const {error, errorMessage, resetValidation, required} = useValidation()

    const fieldRef = ref(null)

    function validate() {
      resetValidation()
      props.rules?.forEach(rule => {
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

    function keywordData(opt) {
      const label = mt(opt)
      const lang = mtr(opt, label)
      const other = Object.entries(opt).filter(([l, val]) => l !== lang && val !== label)

      return {label: label, lang: lang, other: other}
    }

    function addKeyword() {
      $q.dialog({
        component: MultilingualDialog,
        componentProps: {
          title: `${t('action.add')} ${t('label.forms.keyword').toLowerCase()}`
        }
      }).onOk((value) => {
        model.value.push(value)
        onChange()
      })
    }

    function rmKeyword(scope) {
      scope.removeAtIndex(scope.index)
      onChange()
    }

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', model.value)
    }

    function replace() {

    }

    return {
      model,
      fieldRef,
      error,
      errorMessage,
      keywordData,
      addKeyword,
      rmKeyword,
      required,
      validate,
      onChange,
      replace
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
