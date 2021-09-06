<template lang="pug">
.q-pa-md.column
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      multilingual-input.bg-grey-2(label="Multilingual input" ref="m1" v-model="model.m1" :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.m1 }}
      q-btn(label="Validate" color="primary" @click="m1.validate()")
  .row.justify-center.col-auto.q-gutter-lg
    .col-5
      title-input-list.bg-grey-2(label="Title input list" ref="ti1" v-model="model.ti1" :rules="[required('Required')]" )
    .col-5.bg-grey-6.column
      pre.col-auto.bg-dark.text-white.rounded-borders.q-ma-xl.q-pa-md {{ model.ti1 }}
      q-btn(label="Validate" color="primary" @click="ti1.validate()")
</template>

<script>
import MultilingualInput from "components/controls/inputs/MultilingualInput";
import {defineComponent, ref} from "vue";
import useValidation from "src/composables/useValidation";
import TitleInputList from 'components/controls/inputs/TitleInputList'

export default defineComponent({
  name: "Playground",
  components: {
    MultilingualInput,
    TitleInputList
  },
  setup () {
    const {required} = useValidation()

    const model = ref({})
    const m1 = ref(null)
    const ti1 = ref(null)

    return {model, required, m1, ti1}
  }
})
</script>

<style scoped>

</style>
