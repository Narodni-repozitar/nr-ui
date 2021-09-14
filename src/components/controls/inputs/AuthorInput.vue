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
      author-type-select.full-height.col-auto(
        ref="authorType"
        v-model="model.nameType"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="changeType")
      .col-grow.q-ml-sm
        base-input.q-pa-none(
          v-if="isPerson"
          autogrow
          ref="fullName"
          v-model="model.fullName"
          :rules="[required($t('error.validation.required'))]"
          :label="fullNameLabel"
          @update:model-value="onChange")
        term-select.q-pa-none(
          v-else
          ref="organization"
          v-bind="$attrs"
          v-model="model"
          taxonomy="institutions"
          :elasticsearch="false"
          :rules="[required($t('error.validation.required'))]"
          :label="$t('label.institutionName')"
          @update:model-value="onOrgChange")
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
      .col-grow(v-if="isPerson")
        term-list-select(
          ref="affiliations"
          v-bind="$attrs"
          v-model="model.affiliation"
          taxonomy="institutions"
          :elasticsearch="false"
          multiple
          :rules="[required($t('error.validation.required'))]"
          :label="`${$t('label.affiliations')} *`"
          @update:model-value="onChange")
    .row.full-width(v-if="isPerson")
      identifier-input-list(
        v-model="model.authorityIdentifiers"
        ref="identifiers"
        :schemes="PERSON_IDENTIFIER_SCHEMES"
        :label="$t('label.identifiers')"
        :item-label="$t('label.identifier')"
        @update:model-value="onChange")
</template>

<script>
import {computed, ref} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useValidation from '/src/composables/useValidation'
import useInputRefs from '/src/composables/useInputRefs'
import AuthorTypeSelect from 'components/controls/selects/AuthorTypeSelect'
import IdentifierInputList from 'components/controls/inputs/IdentifierInputList'
import {
  AFFILIATIONS,
  AUTHOR_TYPES,
  DEFAULT_AUTHOR_ITEM,
  DEFAULT_ORGANIZATION_ITEM,
  PERSON_IDENTIFIER_SCHEMES
} from '/src/constants'
import TermSelect from 'components/controls/selects/TermSelect'
import ChipsSelect from 'components/controls/selects/ChipsSelect'
import BaseInput from 'components/controls/inputs/BaseInput'
import {useI18n} from 'vue-i18n'
import TermListSelect from 'components/controls/selects/TermListSelect'
import deepcopy from 'deepcopy'
import {useTranslated} from 'src/composables/useTranslated'
import useModel from 'src/composables/useModel'

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
        return DEFAULT_AUTHOR_ITEM
      }
    }
  },
  setup(props, ctx) {
    const model = ref(deepcopy(props.modelValue))
    const {t, locale} = useI18n()
    const {onChange} = useModel(ctx, model)
    const {mt} = useTranslated(locale)
    const {error, required, resetValidation} = useValidation()
    const {input} = useInputRefs()
    const authorType = ref(null)
    const fullName = ref(null)
    const identifiers = ref(null)
    const affiliations = ref(null)
    const organization = ref(null)

    const isPerson = computed(() => {
      return model.value.nameType === AUTHOR_TYPES.PERSON
    })

    const isOrg = computed(() => {
      return model.value.nameType === AUTHOR_TYPES.ORGANIZATION
    })

    const fullNameLabel = computed(() => {
      if (isPerson.value) {
        return `${t('label.fullName')} ${t('label.ofAuthor')} *`
      }
      return `${t('label.name')} ${t('value.authorType.organizational')} *`
    })

    function onOrgChange(newVal) {
      // TODO: what to actually use here as full name??? Should this be correct?
      if (model.value && newVal) {
        model.value = newVal
        model.value.fullName = deepcopy(mt(model.value.title))
      } else {
        model.value = deepcopy(DEFAULT_ORGANIZATION_ITEM)
      }
      onChange()
    }

    function changeType() {
      if (isOrg.value) {
        model.value = deepcopy(DEFAULT_ORGANIZATION_ITEM)
        if (!props.noRoles) {
          model.value.role = []
        }
      } else {
        model.value = deepcopy(DEFAULT_AUTHOR_ITEM)
      }
      onChange()
    }

    function validate() {
      resetValidation()
      let idr = true
      let afr = true
      let or = true
      let fnr = true

      if (!authorType.value) {
        return
      }

      const atr = authorType.value.validate()

      if (isPerson.value) {
        fnr = fullName.value.validate()
        afr = affiliations.value.validate()
      } else {
        or = organization.value.validate()
      }

      if (model.value.authorityIdentifiers?.length) {
        idr = identifiers.value.validate()
      }

      if (atr !== true ||
          fnr !== true ||
          afr !== true ||
          idr !== true ||
          or !== true
      ) {
        error.value = true
      }
      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      authorType,
      fullName,
      identifiers,
      organization,
      error,
      model,
      affiliations,
      fullNameLabel,
      isPerson,
      isOrg,
      changeType,
      validate,
      onChange,
      onOrgChange,
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
