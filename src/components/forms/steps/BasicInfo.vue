<template lang="pug">
.column.q-gutter-sm
  title-input-list.col(
    ref="mainTitle"
    empty
    v-model="model.titles"
    :label="$t('label.titles') + ' *'"
    @update:model-value="onChange"
    :rules="[required($t('error.validation.required'))]")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {titles:basicInfo.titles} }}
  languages-select.col(
    ref="languages"
    v-model="model.language"
    :label="$t('label.language') + ' *'"
    @update:model-value="onChange"
    :rules="[required($t('error.validation.required'))]")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {language:basicInfo.language} }}
  multilingual-editor.col(
    ref="abstract"
    v-model="model.abstract"
    :rules="[required($t('error.validation.required'))]"
    @update:model-value="onChange"
    :label="$t('label.abstract') + ' *'")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {abstract:basicInfo.abstract} }}
  licenses-select.col(
    ref="rights"
    :exclude="['copyright']"
    v-model="model.rights"
    @update:model-value="onChange"
    :label="$t('label.license')")
  publishers-select.col(
    ref="publishers"
    v-model="model.publisher"
    :label="$t('label.publishers') + ' *'"
    @update:model-value="onChange"
    :rules="[required($t('error.validation.required'))]")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {rights:basicInfo.rights} }}
  stepper-nav.q-mt-xl(has-prev=false @next="$emit('next')")
</template>
<script>
import {defineComponent, ref} from 'vue'
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
import deepcopy from 'deepcopy'
import useModel from 'src/composables/useModel'
import PublishersSelect from "components/controls/selects/PublishersSelect";

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
    MultilingualInputList,
    PublishersSelect
  },
  emits: ['update:modelValue', 'next', 'validate'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const primaryCommunity = ref(null)
    const mainTitle = ref(null)
    const abstract = ref(null)
    const languages = ref(null)
    const keywords = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const publishers = ref(null)
    const {required} = useValidation()
    const {onChange} = useModel(ctx, model)

    function validate() {
      const tr = mainTitle.value.validate()
      const abr = abstract.value.validate()
      const pur = publishers.value.validate()
      const lnr = languages.value.validate()


      if (tr !== true ||
          abr !== true ||
          lnr !== true ||
          pur !== true) {
        ctx.emit('validate', false)
      } else {
        ctx.emit('validate', true)
      }
    }

    return {model, required, primaryCommunity, mainTitle, abstract, languages, keywords, validate, onChange, publishers}
  }
})
</script>
<style lang="sass" scoped>
</style>
