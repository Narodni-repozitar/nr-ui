<template lang="pug">
.column.q-gutter-sm
  multilingual-chips.q-my-none.q-py-none.col(
    ref="keywords"
    v-model="description.keywords"
    :label="$t('label.forms.keywords')")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {keywords:description.keywords} }}
  subject-category-input.col(
    ref="subjectCategories"
    v-bind="$attrs"
    v-model="description.subjectCategories"
    taxonomy="subjects"
    multiple
    :rules="[required($t('error.validation.required'))]"
    :elasticsearch="false"
    :label="$t('label.subjectCategories') + ' *    !!!!TODO: CHANGE TAXONOMY TREE!!!!'")
  //pre.q-pa-md.q-ma-md.bg-dark.text-white.text-code.rounded-borders {{ {subjectCategories:description.subjectCategories} }}
  multilingual-editor.q-ml-none.q-mt-none.col(
    ref="methods"
    v-model="description.methods"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.methods')")
  multilingual-editor.q-ml-none.q-mt-none.col(
    ref="technicalInfo"
    v-model="description.technicalInfo"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.technicalInfo')")
  stepper-nav.q-mt-xl(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from 'src/composables/useValidation'
import useNotify from 'src/composables/useNotify'
import StepperNav from 'components/controls/StepperNav'
import MultilingualChips from 'components/controls/inputs/MultilingualChips'
import TermListSelect from 'components/controls/selects/TermListSelect'
import SubjectCategoryInput from 'components/controls/inputs/SubjectCategoryInput'
import MultilingualEditor from 'components/controls/inputs/MultilingualEditor'

export default defineComponent({
  name: 'DatasetDescription',
  components: {
    StepperNav,
    MultilingualChips,
    MultilingualEditor,
    TermListSelect,
    SubjectCategoryInput
  },
  emits: ['update:modelValue', 'next', 'prev'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const keywords = ref(null)
    const subjectCategories = ref(null)
    const methods = ref(null)
    const technicalInfo = ref(null)

    const description = reactive({...(props.modelValue || {})})

    watch(description, () => {
      ctx.emit('update:modelValue', description)
    })

    const onNext = () => {
      const scr = subjectCategories.value.validate()

      if (scr !== true) {
        notifyError('error.validationFail')
      } else {
        ctx.emit('next')
      }
    }

    return {description, required, keywords, subjectCategories, methods, technicalInfo, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
