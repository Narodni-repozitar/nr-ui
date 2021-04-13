<template lang="pug">
q-input.full-width(
  color="primary" outlined square dense v-model="model"
  debounce="500" @keyup.enter='onEnter')

  template(v-slot:prepend)
    q-icon(name="search")

</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import deepcopy from "deepcopy";

export default defineComponent({
      name: 'SearchBox',
      props: {
        modelValue: String,
        route: Object
      },
      emits: ['update:modelValue'],
      setup(props, ctx) {
        const model = ref(props.modelValue)
        const query = useQuery()

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

        return {
          model,
          onEnter
        }
      }
    })
</script>
