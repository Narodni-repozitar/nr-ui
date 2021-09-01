<template lang="pug">
.column.q-gutter-md
  community-select.col(
    ref="primaryCommunity"
    v-model="basicInfo._primary_community"
    :rules="[required($t('error.validation.required'))]")
  title-input.col(
    ref="mainTitle"
    empty
    v-model="basicInfo.titles"
    :label="$t('label.titles') + ' *'"
    :rules="[required($t('error.validation.required'))]")
  pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {titles:basicInfo.titles} }}
  languages-select.col(
    ref="languages"
    v-model="basicInfo.language"
    :label="$t('label.language') + ' *'"
    :rules="[required($t('error.validation.required'))]")
  pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {language:basicInfo.language} }}
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
        v-model="basicInfo.rights"
        :label="$t('label.license')")
    .col-auto

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
import TitleInput from 'components/controls/inputs/TitleInput'

export default defineComponent({
  name: 'BasicInfo',
  components: {
    ChipsSelect,
    BaseInput,
    DateInput,
    TitleInput,
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
    const mainTitle = ref(null)
    const abstract = ref(null)
    const keywords = ref(null)

    const basicInfo = reactive(props.modelValue || {})

    watch(basicInfo, () => {
      ctx.emit('update:modelValue', basicInfo)
    })

    const onNext = () => {
      const pcr = primaryCommunity.value.validate()
      const tr = mainTitle.value.validate()
      const abr = abstract.value.validate()
      const kr = keywords.value.validate()

      if (pcr !== true ||
          tr !== true ||
          abr !== true ||
          kr !== true) {
        notifyError('error.validationFail')

      } else {
        ctx.emit('next')
      }
    }

    return {basicInfo, required, primaryCommunity, mainTitle, abstract, keywords, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
