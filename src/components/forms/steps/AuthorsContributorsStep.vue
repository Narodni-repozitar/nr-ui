<template lang="pug">
q-step(
  icon="groups"
  :done="done"
  :error="error"
  error-icon="groups"
  :name="DATASET_FORM_STEPS.AUTHORS"
  :title="$t('label.forms.authors')")
  authors-contributors(
    ref="input"
    v-model="model"
    :split-name="splitName"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.AUTHORS, $event)"
    @next="$emit('next')"
    @prev="$emit('prev')")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import useModel from 'src/composables/useModel'
import {DATASET_FORM_STEPS} from 'src/constants'
import deepcopy from 'deepcopy'
import AuthorsContributors from 'components/forms/steps/AuthorsContributors'

export default defineComponent({
  name: 'AuthorsContributorsStep',
  components: {AuthorsContributors},
  emits: ['update:modelValue', 'next', 'validate', 'prev'],
  props: {
    done: Boolean,
    error: Boolean,
    modelValue: Object,
    splitName: Boolean
  },
  setup(props, ctx) {
    const input = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (input.value) {
        return input.value.validate()
      }
    }

    const visited = computed(() => {
      return input.value
    })

    return {
      model,
      input,
      visited,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
