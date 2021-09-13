<template lang="pug">
q-badge.shadow-1.q-ml-sm.q-mr-xs.q-pt-xs.cursor-pointer(
  :class="[!dense? 'q-mt-md q-pb-sm' : 'q-pb-sm q-mb-xs']"
  @click="changeLang"
  transparent
  color="accent") {{ model }}
  q-tooltip {{ $t(`value.lang.${model}`) }}
</template>

<script>
import {defineComponent, ref} from 'vue'
import deepcopy from "deepcopy";
import useModel from "src/composables/useModel";

export default defineComponent({
  name: "LangBadge",
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      required: true
    },
    dense: Boolean,
    langPicker: {
      type: Function,
      required: true
    }
  },
  setup(props, ctx) {
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function changeLang() {
      props.langPicker((lang) => {
        model.value = lang
        onChange()
      })
    }

    return {model, changeLang}
  }
})
</script>

<style scoped>
</style>
