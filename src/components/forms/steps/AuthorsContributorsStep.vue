<template lang="pug">
q-step(
  icon="groups"
  :done="done"
  :error="error"
  error-icon="groups"
  :name="DATASET_FORM_STEPS.AUTHORS"
  :title="$t('label.forms.authors')")
  authors-contributors(
    ref="authors"
    v-model="model"
    @update:model-value="onChange"
    @validate="$emit('validate', DATASET_FORM_STEPS.AUTHORS, $event)"
    @next="$emit('next')"
    @prev="$emit('prev')")
</template>
<script>
import {defineComponent, ref} from 'vue'
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
    modelValue: Object
  },
  setup(props, ctx) {
    const authors = ref(null)
    const model = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, model)

    function validate() {
      if (authors.value) {
        return authors.value.validate()
      }
    }

    return {
      model,
      authors,
      validate,
      onChange,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
