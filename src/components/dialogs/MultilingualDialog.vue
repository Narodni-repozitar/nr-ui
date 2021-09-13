<template lang="pug">
q-dialog(ref="dialog" @hide="onDialogHide")
  q-card.q-dialog-plugin(style="width: 700px; max-width: 80vw;")
    q-card-section.q-ml-md.q-mt-md.q-pb-none(v-if="title")
      .text-h5 {{ title }}
    q-card-section
      multilingual-input.q-pa-md(autofocus ref="input" v-model="model")
    q-card-actions(align="right").q-pa-md.q-mr-md
      q-btn(@click="hide" flat color="grey") {{ $t('action.cancel') }}
      q-btn(@click="onOKClick" flat color="positive" icon="done")
        .q-pl-sm {{ $t('action.ok') }}
</template>
<script>
import {defineComponent, ref} from 'vue'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import deepcopy from "deepcopy";

export default defineComponent({
  name: 'MultilingualDialog',
  components: {MultilingualInput},
  emits: ['ok', 'hide'],
  props: {
    title: String,
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const model = ref(deepcopy(props.value))

    function show() {
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    function onOKClick() {
      ctx.emit('ok', model.value)
      hide()
    }

    function onCancelClick() {
      hide()
    }

    return {
      dialog,
      model,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick
    }
  }
})
</script>

<style lang="sass">
</style>
