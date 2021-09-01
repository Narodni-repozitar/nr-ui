<template lang="pug">
q-field.bg-grey-2.q-pa-sm.fit(
  ref="input"
  v-bind="$attrs"
  :error="error"
  stack-label
  square
  borderless
  :label="authorLabel")
  template(v-slot:control)
    .row.full-width.q-mt-md.q-mb-md
      author-type-select.col-auto(
        ref="authorType"
        v-model="model.person_or_org.type"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="onChange")
      base-input.q-pa-none.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.PERSON"
        autogrow
        ref="givenName"
        v-model="model.person_or_org.given_name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.givenName') + ' *'"
        @update:model-value="onChange")
      base-input.q-pa-none.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.PERSON"
        autogrow
        ref="familyName"
        v-model="model.person_or_org.family_name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.familyName') + ' *'"
        @update:model-value="onChange")
      base-input.q-pa-none.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.ORGANIZATION"
        autogrow
        ref="name"
        v-model="model.person_or_org.name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.name')"
        @update:model-value="onChange")
    .row.full-width.q-mb-sm
      .col-auto.q-mr-sm.q-mb-sm(v-if="!noRoles")
        term-select(
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
        term-select(
          ref="affiliations"
          v-bind="$attrs"
          v-model="model.affiliations"
          taxonomy="institutions"
          :elasticsearch="false"
          multiple
          :label="$t('label.affiliations')"
          @update:model-value="onChange")
    .row.full-width
      identifier-input-list(
        v-model="model.person_or_org.identifiers"
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

export default {
  name: 'IdentifierInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  components: {IdentifierInputList, AuthorTypeSelect, TermSelect, ChipsSelect, BaseInput},
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
          person_or_org: {
            name: '',
            type: 'personal',
            given_name: '',
            family_name: '',
            identifiers: []
          }, role: [], affiliations: []
        }
      }
    }
  },
  setup(props, ctx) {
    const {error, required, resetValidation} = useValidation()
    const {input} = useInputRefs()
    const authorType = ref(null)
    const givenName = ref(null)
    const familyName = ref(null)
    const name = ref(null)
    const identifiers = ref(null)

    const model = reactive(props.modelValue)

    const personName = computed(() => {
      return `${model.person_or_org.family_name}, ${model.person_or_org.given_name}`
    })

    const authorLabel = computed(() => {
      if (model.person_or_org.name === '') {
        return props.label
      } else {
        return `${props.label} - ${model.person_or_org.name}`
      }
    })

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      console.log(givenName.value) // <div>This is a root element</div>
    })


    function onChange() {
      if (model.person_or_org.type === AUTHOR_TYPES.PERSON) {
        model.person_or_org.name = personName.value
      }

      // TODO: create affiliations input
      if (model.affiliations) {
        model.affiliations = model.affiliations.map(a => {
          return typeof a === 'string' ? {name: a} : a
        })
      }

      resetValidation()
      ctx.emit('update:modelValue', model)
    }

    function validate() {
      let atr = true
      let idr = true

      if (!props.noRoles) {
        atr = authorType.value.validate()
      }
      if (identifiers.value) {
        idr = identifiers.value.validate()
      }

      if (model.person_or_org.type === AUTHOR_TYPES.PERSON) {
        const gnr = givenName.value.validate()
        const fnr = familyName.value.validate()
        if (atr !== true ||
            gnr !== true ||
            fnr !== true ||
            idr !== true) {
          error.value = true
        }
      } else if (model.person_or_org.type === AUTHOR_TYPES.ORGANIZATION) {
        const nr = name.value.validate()
        if (atr !== true ||
            nr !== true ||
            idr !== true) {
          error.value = true
        }
      }

      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      authorType,
      givenName,
      familyName,
      name,
      identifiers,
      error,
      model,
      personName,
      authorLabel,
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
