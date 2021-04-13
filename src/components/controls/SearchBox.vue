<template lang="pug">
q-input.full-width(
  color="primary" outlined square dense v-model="model"
  debounce="500" @keyup.enter='onEnter' ref="input"
  autofocus)

  template(v-slot:prepend)
    q-icon(name="search")

  template(v-slot:append)
    cancel-button(v-if="model" @click="clear")

</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import deepcopy from "deepcopy";
import CancelButton from './CancelButton.vue'

export default defineComponent({
  name: 'SearchBox',
  props: {
    modelValue: String,
    route: Object
  },
  components: {
    CancelButton
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const model = ref(props.modelValue)
    const query = useQuery()
    const input = ref()

    watch(() => props.modelValue, () => {
      if (props.modelValue !== model.value) {
        model.value = props.modelValue
      }
    })

    watch(model, (val) => {
      if (!props.route) {
        query.q = val
      }
    })

    function onEnter() {
      if (props.route) {
        const r = deepcopy(props.route)
        if (!r.query) {
          r.query = {}
        }
        r.query.q = model.value
      } else {
        query.q = val
      }
      ctx.emit('update:modelValue', val)
    }

    function clear() {
      model.value = undefined
      input.value.focus()
    }

    return {
      model,
      onEnter,
      clear,
      input
    }
  }
})
</script>
