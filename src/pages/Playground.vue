<template lang="pug">
.q-pa-md.column
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      multilingual-input.bg-grey-2(label="Multilingual input *" ref="m1" v-model="model.m1" :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.m1 }}
      q-btn(label="Validate" color="primary" @click="m1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      title-input-list.bg-grey-2(label="Title input list" ref="ti1" v-model="model.ti1" :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ti1 }}
      q-btn(label="Validate" color="primary" @click="ti1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      multilingual-editor.bg-grey-2(label="Multilingual editor *" ref="me1" v-model="model.me1" :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.me1 }}
      q-btn(label="Validate" color="primary" @click="me1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      term-select.bg-grey-2(
        label="Term select *"
        ref="ts1"
        taxonomy="licenses"
        multiple
        hide-bottom-space
        leaf-only
        :exclude="['copyright']"
        :selector-title="`${$t('action.choose')} terms`"
        :elasticsearch="false"
        v-model="model.ts1"
        :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ts1 }}
      q-btn(label="Validate" color="primary" @click="ts1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      term-select.bg-grey-2(
        label="Single term select *"
        ref="ts2"
        taxonomy="licenses"
        hide-bottom-space
        leaf-only
        :exclude="['copyright']"
        :selector-title="`${$t('action.choose')} term`"
        :elasticsearch="false"
        v-model="model.ts2"
        :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ts2 }}
      q-btn(label="Validate" color="primary" @click="ts2.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      author-input.no-padding.col(
        v-model="model.ai1"
        ref="ai1"
        no-roles
        :rules="[required('Required')]"
        :label="$t('label.authors') + ' *'"
        :item-label="$t('label.author')")
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ai1 }}
      q-btn(label="Validate" color="primary" @click="ai1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      author-input-list.no-padding.col(
        v-model="model.ail1"
        ref="ail1"
        no-roles
        :rules="[required('Required')]"
        :label="$t('label.authors') + ' *'"
        :item-label="$t('label.author')")
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ail1 }}
      q-btn(label="Validate" color="primary" @click="ail1.validate()")
</template>

<script>
import MultilingualInput from "components/controls/inputs/MultilingualInput";
import {defineComponent, ref} from "vue";
import useValidation from "src/composables/useValidation";
import TitleInputList from 'components/controls/inputs/TitleInputList'
import MultilingualEditor from "components/controls/inputs/MultilingualEditor";
import TermSelect from "components/controls/selects/TermSelect";
import AuthorInput from "components/controls/inputs/AuthorInput";
import AuthorInputList from "components/controls/inputs/AuthorInputList";

export default defineComponent({
  name: "Playground",
  components: {
    AuthorInput,
    AuthorInputList,
    MultilingualInput,
    TitleInputList,
    MultilingualEditor,
    TermSelect
  },
  setup () {
    const {required} = useValidation()

    const model = ref({})
    const m1 = ref(null)
    const ti1 = ref(null)
    const me1 = ref(null)
    const ts1 = ref(null)
    const ts2 = ref(null)
    const ai1 = ref(null)
    const ail1 = ref(null)

    return {model, required, m1, ti1, me1, ts1, ts2, ai1, ail1}
  }
})
</script>

<style scoped>

</style>
