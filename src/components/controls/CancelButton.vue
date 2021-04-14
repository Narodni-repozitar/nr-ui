<template lang="pug">
q-btn(v-bind="attrs" @click="onClick" flat dense)
  q-icon(name="svguse:/icons.svg#cancel")
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'cancel-button',
  emits: ['click'],
  setup(props, ctx) {
    function onClick() {
      ctx.emit('click')
    }

    return {
      onClick,
      attrs: ctx.attrs
    }
  }
})
</script>
