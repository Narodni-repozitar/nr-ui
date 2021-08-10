<template lang="pug">
term-select(
  v-bind="$attrs"
  v-model="model"
  :label="$t('label.localeSwitcher')"
  :hint="$t('hint.localeSwitcher')"
  dense
  ref="input"
  taxonomy="languages"
  multiple
  :elasticsearch="false"
  :rules="rules"
  @update:model-value="onChange($event)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import TermSelect from 'components/controls/selects/TermSelect'

export default defineComponent({
  name: 'LanguagesSelect',
  emits: ['update:modelValue'],
  components: {TermSelect},
  mixins: [ValidateMixin],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup (props, ctx) {
    const model = ref(props.modelValue)

    function onChange(event) {
      ctx.emit('update:modelValue', event)
    }

    return {model, onChange}
  }
})
</script>
