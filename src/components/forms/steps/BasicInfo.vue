<template lang="pug">
.column.q-gutter-sm
  title-input-list.col(
    ref="mainTitle"
    empty
    v-model="basicInfo.titles"
    :label="$t('label.titles') + ' *'"
    :rules="[required($t('error.validation.required'))]")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {titles:basicInfo.titles} }}
  languages-select.col(
    ref="languages"
    v-model="basicInfo.language"
    :label="$t('label.language') + ' *'"
    :rules="[required($t('error.validation.required'))]")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {language:basicInfo.language} }}
  multilingual-editor.col(
    ref="abstract"
    v-model="basicInfo.abstract"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.abstract') + ' *'")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {abstract:basicInfo.abstract} }}
  licenses-select.col(
    ref="rights"
    :exclude="['copyright']"
    v-model="basicInfo.rights"
    :label="$t('label.license')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {rights:basicInfo.rights} }}
  stepper-nav.q-mt-xl(has-prev=false @next="$emit('next')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
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
import TitleInputList from 'components/controls/inputs/TitleInputList'
import {DEFAULT_MAIN_TITLE} from 'src/constants'

export default defineComponent({
  name: 'BasicInfo',
  components: {
    ChipsSelect,
    BaseInput,
    DateInput,
    TitleInputList,
    CommunitySelect,
    StepperNav,
    LanguagesSelect,
    LicensesSelect,
    MultilingualInput,
    MultilingualEditor,
    MultilingualEditorList,
    MultilingualInputList
  },
  emits: ['update:modelValue', 'next', 'validate'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const primaryCommunity = ref(null)
    const mainTitle = ref(null)
    const abstract = ref(null)
    const languages = ref(null)
    const keywords = ref(null)

    const basicInfo = reactive({
      titles: [DEFAULT_MAIN_TITLE],
      language: [
        {
          "alpha2": "en",
          "busy_count": 0,
          "descendants_busy_count": 0,
          "descendants_count": 0,
          "level": 1,
          "links": {
            "self": "https://127.0.0.1:5000/2.0/taxonomies/languages/eng",
            "tree": "https://127.0.0.1:5000/2.0/taxonomies/languages/eng?representation:include=dsc"
          },
          "slug": "eng",
          "status": "alive",
          "title": {
            "cs": "angličtina",
            "en": "English"
          },
          "data": {
            "alpha2": "en",
            "busy_count": 0,
            "descendants_busy_count": 0,
            "descendants_count": 0,
            "level": 1,
            "links": {
              "self": "https://127.0.0.1:5000/2.0/taxonomies/languages/eng",
              "tree": "https://127.0.0.1:5000/2.0/taxonomies/languages/eng?representation:include=dsc"
            },
            "slug": "eng",
            "status": "alive",
            "title": {
              "cs": "angličtina",
              "en": "English"
            }
          },
          "self": "https://127.0.0.1:5000/2.0/taxonomies/languages/eng",
          "label": "angličtina"
        }
      ], ...(props.modelValue || {})
    })

    watch(basicInfo, () => {
      ctx.emit('update:modelValue', basicInfo)
    })

    function validate() {
      const tr = mainTitle.value.validate()
      const abr = abstract.value.validate()
      const lnr = languages.value.validate()

      if (tr !== true ||
          abr !== true ||
          lnr !== true) {
        ctx.emit('validate', false)
      } else {
        ctx.emit('validate', true)
      }
    }

    return {basicInfo, required, primaryCommunity, mainTitle, abstract, languages, keywords, validate}
  }
})
</script>
<style lang="sass" scoped>
</style>
