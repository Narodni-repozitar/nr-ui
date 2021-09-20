<template lang="pug">
.column.q-gutter-sm
  author-input-list.full-width.no-padding.col(
    v-model="model.creators"
    ref="creators"
    no-roles
    :label="$t('label.authors')"
    :item-label="$t('label.author')"
    :add-item-label="$t('label.ofAuthor')"
    @update:model-value="onChange")
  author-input-list.full-width.no-padding.col(
    v-model="model.contributors"
    ref="contributors"
    :label="$t('label.contributors')"
    :item-label="$t('label.contributor')"
    :add-item-label="$t('label.ofContributor')"
    @update:model-value="onChange")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {creators:model.creators, contributors:model.contributors} }}
  stepper-nav(has-prev @next="$emit('next')" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import AuthorInputList from 'components/controls/inputs/AuthorInputList'
import AuthorInput from 'components/controls/inputs/AuthorInput'
import {DEFAULT_AUTHOR_ITEM} from 'src/constants'
import useValidation from 'src/composables/useValidation'
import {useI18n} from 'vue-i18n'
import useAuth from 'src/composables/useAuth'
import useModel from "src/composables/useModel";
import deepcopy from "deepcopy";

export default defineComponent({
  name: 'AuthorsContributors',
  components: {AuthorInputList, AuthorInput, StepperNav},
  emits: ['update:modelValue', 'prev', 'next', 'validate'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const model = ref(reactive({
      creators: [],
      contributors: [],
      ...deepcopy(props.modelValue)
    }))

    const {t} = useI18n()
    const {onChange} = useModel(ctx, model)
    const {currentUserName} = useAuth()
    const {required} = useValidation()

    if (!model.value.creators.length) {
      model.value.creators.push({
        ...DEFAULT_AUTHOR_ITEM,
        ...{fullName: currentUserName}
      })
    }

    const creators = ref(null)
    const contributors = ref(null)

    function validate() {
      const crr = creators.value.validate()
      const cor = contributors.value.validate()

      const req = required(t('error.validation.required'))(model.value.creators)
      if (req !== true) {
        creators.value.error = true
        creators.value.errorMessage = req
        ctx.emit('validate', false)
        return
      }

      if (crr !== true) {
        ctx.emit('validate', false)
        return
      } else if (cor !== true) {
        ctx.emit('validate', false)
        return
      }
      ctx.emit('validate', true)
    }

    return {model, creators, contributors, onChange, required, validate}
  }
})
</script>
<style lang="sass" scoped>
</style>
