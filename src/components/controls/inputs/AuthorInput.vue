<template lang="pug">
q-field.no-margin.no-label-float.row(
  ref="input"
  :error="error"
  stack-label
  square
  borderless
  :label="label")
  template(v-slot:control)
    .row.full-width.q-mt-md.no-wrap
      author-type-select.full-height.col-auto(
        ref="authorType"
        v-model="model.nameType"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="changeType")
      base-input.q-ml-sm.q-pa-none.col-grow(
        v-if="isPerson && splitName"
        autogrow
        autofocus
        ref="familyNameRef"
        v-model="familyName"
        :rules="[required($t('error.validation.required'))]"
        :label="`${$t('label.familyName')} *`"
        @update:model-value="onPersonNameChange")
      base-input.q-ml-sm.q-pa-none.col-grow(
        v-if="isPerson && splitName"
        autogrow
        ref="givenNameRef"
        v-model="givenName"
        :rules="[required($t('error.validation.required'))]"
        :label="`${$t('label.givenName')} *`"
        @update:model-value="onPersonNameChange")
      base-input.q-ml-sm.q-pa-none.col-grow(
          v-if="isPerson && !splitName"
          autogrow
          autofocus
          ref="fullName"
          v-model="model.fullName"
          :rules="[required($t('error.validation.required'))]"
          :label="`${$t('label.name')} ${$t('label.ofAuthor')} *`"
          @update:model-value="onChange")
      .col-grow.q-ml-sm(v-if="isOrg")
        term-select.q-pa-none(
          autofocus
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
          :label="$t('section.roles')"
          @update:model-value="onChange")
      .col-grow(v-if="isPerson")
        term-list-select(
          ref="affiliations"
          v-bind="$attrs"
          v-model="model.affiliation"
          taxonomy="institutions"
          :elasticsearch="false"
          multiple
          :selector-title="$t('label.affiliations')"
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
    splitName: Boolean,
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
    const givenNameRef = ref(null)
    const givenName = ref(deepcopy(props.modelValue.givenName))
    const familyNameRef = ref(null)
    const familyName = ref(deepcopy(props.modelValue.familyName))
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
      return `${t('label.name')} ${t('value.authorType.organizational')} *`
    })

    function onPersonNameChange() {
      model.value.fullName = `${familyName.value || ''}, ${givenName.value || ''}`
      onChange()
    }

    function onOrgChange(newVal) {
      // TODO: what to actually use here as full name??? Should this be correct?
      if (model.value && newVal) {
        model.value = newVal
        // Keep the settings neccessary for orgs
        model.value.fullName = deepcopy(mt(model.value.title))
        model.value.nameType = AUTHOR_TYPES.ORGANIZATION
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
      let gnr = true

      if (!authorType.value) {
        return
      }

      const atr = authorType.value.validate()

      if (isPerson.value) {
        if (props.splitName) {
          gnr = givenNameRef.value.validate()
          fnr = familyNameRef.value.validate()
        } else {
          fnr = fullName.value.validate()
        }
        afr = affiliations.value.validate()
      } else {
        or = organization.value.validate()
      }

      if (model.value.authorityIdentifiers?.length) {
        idr = identifiers.value.validate()
      }

      if (atr !== true ||
          gnr !== true ||
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
      givenName,
      givenNameRef,
      familyName,
      familyNameRef,
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
      onPersonNameChange,
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
