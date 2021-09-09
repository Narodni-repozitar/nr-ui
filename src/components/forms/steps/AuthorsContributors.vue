<template lang="pug">
.column.q-pa-md.q-gutter-sm
  author-input-list.no-padding.col(
    v-model="model.creators"
    ref="creators"
    no-roles
    :label="$t('label.authors')"
    :item-label="$t('label.author')")
  author-input-list.no-padding.col(
    v-model="model.contributors"
    ref="contributors"
    :label="$t('label.contributors')"
    :item-label="$t('label.contributor')")
  stepper-nav(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import StepperNav from 'components/controls/StepperNav'
import useNotify from 'src/composables/useNotify'
import AuthorInputList from 'components/controls/inputs/AuthorInputList'
import AuthorInput from 'components/controls/inputs/AuthorInput'
import {DEFAULT_AUTHOR_ITEM} from 'src/constants'
import useModel from "src/composables/useModel";

export default defineComponent({
  name: 'AuthorsContributors',
  components: {AuthorInputList, AuthorInput, StepperNav},
  emits: ['update:modelValue', 'prev', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {notifyError} = useNotify()

    const model = ref(props.modelValue)

    const {isEmpty} = useModel(ctx, model)

    const creators = ref(null)
    const contributors = ref(null)

    if (isEmpty.value) {
      model.value = reactive({creators: [DEFAULT_AUTHOR_ITEM], contributors: []})
    }

    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    function onNext() {
      const crr = creator.value.validate()
      const cor = contributors.value.validate()

      if (crr !== true) {
        notifyError(crr)
        return
      } else if (cor !== true) {
        notifyError(cor)
        return
      }

      ctx.emit('next')
    }

    return {model, creators, contributors, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
