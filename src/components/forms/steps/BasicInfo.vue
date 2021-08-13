<template lang="pug">
.column.q-col-gutter-md
  community-select.col(
    ref="primaryCommunity"
    v-model="basicInfo._primary_community"
    :rules="[required($t('error.validation.required'))]")
  multilingual-input.col(
    ref="title"
    v-model="basicInfo.title"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.titles') + ' *'")
  multilingual-input-list.col(
    ref="additionalTitles"
    empty
    v-model="basicInfo.additional_titles"
    :label="$t('label.forms.additionalTitles')")
  multilingual-editor.col(
    ref="abstract"
    v-model="basicInfo.abstract"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.abstract') + ' *'")
  chips-select.col(
    ref="keywords"
    v-model="basicInfo.keywords"
    :label="$t('label.forms.keywords')")
  .row.q-my-sm.col.q-col-gutter-md.justify-start.items-start
    .col-auto
      licenses-select(
        ref="rights"
        v-model="basicInfo.licenses"
        :label="$t('label.license')")
    .col-auto
      languages-select(
        ref="languages"
        v-model="basicInfo.languages"
        :label="$t('label.languages')")
    .col-auto
      base-input.q-pa-none(
        ref="publisher"
        dense
        autogrow
        v-model="basicInfo.publisher"
        :label="$t('label.publisher')")
    .col-auto
      date-input(
        ref="publication_date"
        dense
        v-model="basicInfo.publication_date"
        :hint="$t('hint.publicationDate')"
        :label="$t('label.publicationDate')")
  stepper-nav.q-mt-xl(has-prev=false @next="onNext")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import useNotify from 'src/composables/useNotify'
import StepperNav from 'components/controls/StepperNav'
import LanguagesSelect from 'components/controls/selects/LanguagesSelect'
import LicensesSelect from 'components/controls/selects/LicensesSelect'
import CommunitySelect from 'components/controls/selects/CommunitySelect'
import BaseInput from 'components/controls/inputs/BaseInput'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import MultilingualEditor from 'components/controls/inputs/MultilingualEditor'
import MultilingualEditorList from 'components/controls/inputs/MultilingualEditorList'
import ChipsSelect from 'components/controls/selects/ChipsSelect'
import DateInput from 'components/controls/inputs/DateInput'
import MultilingualInputList from 'components/controls/inputs/MultilingualInputList'

export default defineComponent({
  name: 'BasicInfo',
  components: {
    ChipsSelect,
    BaseInput,
    DateInput,
    CommunitySelect,
    StepperNav,
    LanguagesSelect,
    LicensesSelect,
    MultilingualInput,
    MultilingualEditor,
    MultilingualEditorList,
    MultilingualInputList
  },
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
