<template lang="pug">
q-input.full-width(
  color="primary" outlined square :dense='dense' v-model="model"
  debounce="500" @keyup.enter='onEnter' ref="input"
  autofocus placeholder="Hledat ...")

  template(v-slot:prepend)
    q-icon(name="search")

  template(v-slot:append)
    cancel-button(v-if="model" @click="clear" size="md")

</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import deepcopy from "deepcopy";
import CancelButton from './CancelButton.vue'
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'SearchBox',
  props: {
    modelValue: String,
    route: Object,
    dense: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CancelButton
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const model = ref(props.modelValue)
    const query = useQuery()
    const input = ref()
    const router = useRouter()

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
        router.push(r)
      } else {
        query.q = model.value
      }
      ctx.emit('update:modelValue', model.value)
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
