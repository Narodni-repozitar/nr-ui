<template lang="pug">
.column.q-gutter-sm
  author-input-list.full-width.no-padding.col(
    v-model="model.creators"
    ref="creators"
    no-roles
    :label="$t('label.authors')"
    :item-label="$t('label.author')")
  author-input-list.full-width.no-padding.col(
    v-model="model.contributors"
    ref="contributors"
    :label="$t('label.contributors')"
    :item-label="$t('label.contributor')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {creators:model.creators, contributors:model.contributors} }}
  stepper-nav(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import AuthorInputList from 'components/controls/inputs/AuthorInputList'
import AuthorInput from 'components/controls/inputs/AuthorInput'
import {DEFAULT_AUTHOR_ITEM} from 'src/constants'
import useValidation from 'src/composables/useValidation'
import {useI18n} from 'vue-i18n'
import useAuth from 'src/composables/useAuth'

export default defineComponent({
  name: 'AuthorsContributors',
  components: {AuthorInputList, AuthorInput, StepperNav},
  emits: ['update:modelValue', 'prev', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {t} = useI18n()
    const {notifyError} = useNotify()
    const {currentUserName} = useAuth()
    const {required} = useValidation()

    const model = ref(props.modelValue)

    const creators = ref(null)
    const contributors = ref(null)

    model.value = reactive({
      creators: props.modelValue.creators?.length ? [...props.modelValue.creators] : [{
        ...DEFAULT_AUTHOR_ITEM,
        ...{fullName: currentUserName}
      }],
      contributors: props.modelValue.contributors?.length ? [...props.modelValue.contributors] : []
    })

    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    function onNext() {
      const crr = creators.value.validate()
      const cor = contributors.value.validate()

      const req = required(t('error.validation.required'))(model.value.creators)
      if (req !== true) {
        creators.value.error = true
        creators.value.errorMessage = req
        notifyError(req)
        return
      }

      if (crr !== true) {
        notifyError(crr)
        return
      } else if (cor !== true) {
        notifyError(cor)
        return
      }

      ctx.emit('next')
    }

    return {model, creators, contributors, required, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
