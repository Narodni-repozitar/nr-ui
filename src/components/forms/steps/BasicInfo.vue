<template lang="pug">
.column
  community-select.col(
    ref="primaryCommunity"
    filled
    v-model="basicInfo._primary_community"
    :rules="[required($t('error.validation.required'))]")
  multilingual-input.col(
    ref="title"
    filled
    v-model="basicInfo.title"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.titles') + ' *'")
  multilingual-editor-list.col(
    ref="additionalTitles"
    empty
    v-model="basicInfo.additional_titles"
    :label="$t('label.forms.additionalTitles')")
  multilingual-editor.col(
    ref="abstract"
    filled
    v-model="basicInfo.abstract"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.abstract') + ' *'")
  chips-select.col(
    ref="keywords"
    filled
    v-model="basicInfo.keywords"
    :label="$t('label.forms.keywords')")
  .row.q-my-sm.col.q-col-gutter-md.justify-start
    .col-auto
      licenses-select(
        filled
        ref="rights"
        v-model="basicInfo.rights"
        :label="$t('label.license')")
    .col-auto
      languages-select(
        filled
        ref="languages"
        v-model="basicInfo.languages"
        :label="$t('label.languages')")
    .col-auto
      date-input(
        ref="publication_date"
        filled
        dense
        v-model="basicInfo.publication_date"
        :hint="$t('hint.publicationDate')"
        :label="$t('label.publicationDate')")
    .col-grow
      base-input.q-mr-sm(
        ref="publisher"
        filled
        dense
        v-model="basicInfo.publisher"
        :label="$t('label.publisher')")

  stepper-nav.q-mt-md(has-prev=false @next="onNext")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import useNotify from 'src/composables/useNotify'
import StepperNav from 'components/controls/StepperNav'
import LanguagesSelect from 'components/controls/inputs/LanguagesSelect'
import LicensesSelect from 'components/controls/inputs/LicensesSelect'
import CommunitySelect from 'components/controls/inputs/CommunitySelect'
import BaseInput from 'components/controls/inputs/BaseInput'

export default defineComponent({
  name: 'BasicInfo',
  components: {BaseInput, CommunitySelect, StepperNav, LanguagesSelect, LicensesSelect},
  emits: ['update:modelValue', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const primaryCommunity = ref(null)
    const title = ref(null)
    const abstract = ref(null)
    const keywords = ref(null)
    const additionalTitles = ref(null)

    const basicInfo = reactive(props.modelValue || {})

    watch(basicInfo, () => {
      ctx.emit('update:modelValue', basicInfo)
    })

    const onNext = () => {
      const pcr = primaryCommunity.value.validate()
      const tr = title.value.validate()
      const abr = abstract.value.validate()
      const kr = keywords.value.validate()
      const atr = additionalTitles.value.validate()

      if (pcr !== true ||
          tr !== true ||
          abr !== true ||
          kr !== true ||
          atr !== true) {
        notifyError('error.validationFail')
        return
      } else {
        ctx.emit('next')
      }
    }

    return {basicInfo, required, primaryCommunity, title, abstract, keywords, additionalTitles, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
