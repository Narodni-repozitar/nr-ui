<template lang="pug">
q-field.no-margin.no-label-float.row(
  ref="input"
  :error="error"
  stack-label
  square
  borderless
  :label="label")
  template(v-slot:control)
    .row.full-width.q-mt-md
      author-type-select.col-auto(
        ref="authorType"
        v-model="model.nameType"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="onChange")
      base-input.q-pa-none.q-ml-sm.col-grow(
        autogrow
        ref="fullName"
        v-model="model.fullName"
        :rules="[required($t('error.validation.required'))]"
        :label="fullNameLabel"
        @update:model-value="onChange")
    .row.full-width.q-mb-sm
      .col-auto.q-mr-sm.q-mb-sm(v-if="!noRoles")
        term-list-select.q-mt-none(
          ref="input"
          v-bind="$attrs"
          v-model="model.role"
          taxonomy="contributor-type"
          multiple
          :selector-title="`${$t('action.choose')} ${label.toLowerCase()}`"
          :elasticsearch="false"
          :label="$t('label.authorType')"
          @update:model-value="onChange")
      .col-grow
        term-list-select(
          ref="affiliations"
          v-bind="$attrs"
          v-model="model.affiliation"
          taxonomy="institutions"
          :elasticsearch="false"
          multiple
          :rules="[required($t('error.validation.required'))]"
          :label="$t('label.affiliations')"
          @update:model-value="onChange")
    .row.full-width
      identifier-input-list(
        v-model="model.authorityIdentifiers"
        ref="identifiers"
        :schemes="PERSON_IDENTIFIER_SCHEMES"
        :label="$t('label.identifiers')"
        :item-label="$t('label.identifier')"
        @update:model-value="onChange")
</template>

<script>
import {computed, onMounted, reactive, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useValidation from '/src/composables/useValidation'
import useInputRefs from '/src/composables/useInputRefs'
import AuthorTypeSelect from 'components/controls/selects/AuthorTypeSelect'
import IdentifierInputList from 'components/controls/inputs/IdentifierInputList'
import {AFFILIATIONS, AUTHOR_TYPES, PERSON_IDENTIFIER_SCHEMES} from '/src/constants'
import TermSelect from 'components/controls/selects/TermSelect'
import ChipsSelect from 'components/controls/selects/ChipsSelect'
import BaseInput from 'components/controls/inputs/BaseInput'
import {useI18n} from "vue-i18n";
import TermListSelect from 'components/controls/selects/TermListSelect'

export default {
  name: 'AuthorInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  components: {IdentifierInputList, AuthorTypeSelect, TermSelect, TermListSelect, ChipsSelect, BaseInput},
  props: {
    label: {
      type: String,
      default: ''
    },
    noRoles: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => {
        return {
          fullName: '',
          nameType: AUTHOR_TYPES.PERSON,
          identifiers: [],
          role: [], affiliation: []
        }
      }
    }
  },
  setup(props, ctx) {
    const {t} = useI18n()
    const {error, required, resetValidation} = useValidation()
    const {input} = useInputRefs()
    const authorType = ref(null)
    const fullName = ref(null)
    const identifiers = ref(null)
    const affiliations = ref(null)

    const model = reactive(props.modelValue)

    const fullNameLabel = computed(() => {
      if (model.nameType === AUTHOR_TYPES.PERSON) {
        return `${t('label.fullName')} ${t('label.ofAuthor')} *`
      }
      return `${t('label.name')} ${t('value.authorType.organizational')} *`
    })

    function onChange() {
      ctx.emit('update:modelValue', model)
    }

    function validate() {
      resetValidation()
      let idr = true

      const atr = authorType.value.validate()
      const fnr = fullName.value.validate()
      const afr = affiliations.value.validate()

      if (identifiers.value.length) {
        idr = identifiers.value.validate()
      }

      if (atr !== true ||
          fnr !== true ||
          afr !== true ||
          idr !== true) {
        error.value = true
      }

      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      authorType,
      fullName,
      identifiers,
      error,
      model,
      affiliations,
      fullNameLabel,
      validate,
      onChange,
      required,
      PERSON_IDENTIFIER_SCHEMES,
      AUTHOR_TYPES,
      AFFILIATIONS
    }
  }
}
</script>

<style scoped>

</style>
