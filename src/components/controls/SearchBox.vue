<template lang="pug">
q-input.search-box.full-width(
  color="primary" outlined square :dense='dense' bg-color="transparent-grey" v-model="model"
  debounce="500" @change="onEnter" @keyup.enter="onEnter" ref="input"
  autofocus :placeholder="`${$t('action.search')}…`")
  template(v-slot:prepend)
    q-icon(name="search")
  template(v-slot:append)
    cancel-button(v-if="model" @click="clear" size="md")
</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import deepcopy from "deepcopy";
import CancelButton from 'components/controls/buttons/CancelButton'
import {useRouter} from 'vue-router'

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
  emits: ['update:modelValue', 'fulltext'],
  setup(props, ctx) {
    const query = useQuery()
    const model = ref(props.modelValue || query.q)
    const input = ref()
    const router = useRouter()
    const fullText = ref(true)

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
    //
    // function onFullTextToggle () {
    //   ctx.emit('fulltext', fullText)
    // }

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
      fullText,
      onEnter,
      clear,
      // onFullTextToggle,
      input
    }
  }
})
</script>
<style lang="sass">
.nr .q-field--outlined .q-field__control::before
  background-color: $transparent-grey
</style>
