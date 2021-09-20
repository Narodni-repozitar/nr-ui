<template lang="pug">
q-field.no-wrap.no-margin.no-label-float.row(
  stack-label
  square
  borderless)
  template(v-slot:control)
    .row.full-width
      q-input.col-grow(
        v-if="range"
        ref="from"
        outlined
        square
        color="primary"
        :rules="[edtf0Rule, ...(rules || [])]"
        :label="`${label}${range? '(' + $t('label.from') + ')' : ''}`"
        v-model="internalFromModel")
      q-input.col-grow(
        ref="input"
        outlined
        square
        autofocus
        color="primary"
        :rules="[edtf0Rule, ...(rules || [])]"
        :label="`${label}${range? '(' + $t('label.to') + ')' : ''}`"
        v-model="internalToModel"
        @update:model-value="$emit('update:modelValue', $event)")
  template(v-slot:append)
    q-icon.self-center.q-mt-sm(name="event" class="cursor-pointer")
    q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
      q-date(
        flat
        v-model="model"
        :mask="mask"
        minimal
        :range="range"
        v-bind="$attrs")
        .row.items-center.justify-end
          q-btn(v-close-popup :label="$t('action.close')" color="primary" flat)
</template>

<script>
import {computed, ref, watch} from 'vue'
import ValidateMixin from '/src/mixins/ValidateMixin'
import useDate from '/src/composables/useDate'
import deepcopy from "deepcopy";

export default {
  name: 'DateInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    range: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const model = ref(_parsePropsModel())

    const {edtf0Mask, edtf0Rule} = useDate()

    const input = ref(null)

    const mask = 'YYYY-MM-DD'

    function _parsePropsModel() {
      if (props.range) {
        const dates = props.modelValue.split('/')
        return deepcopy({
          from: dates[0],
          to: dates[1]
        })
      }
      return deepcopy(props.modelValue)
    }

    const internalFromModel = computed({
      get: () => {
        if (props.range) {
          return model.value.from
        }
        return model.value
      }, set: (val) => {
        if (props.range) {
          return model.value.from = val
        }
        return model.value = val
      }
    })

    const internalToModel = computed({
      get: () => {
        if (props.range) {
          return model.value.to
        }
        return model.value
      }, set: (val) => {
        if (props.range) {
          return model.value.to = val
        }
        return model.value = val
      }
    })

    const externalModel = computed(() => {
      if (props.range && model.value.from && model.value.to) {
        return `${model.value.from}/${model.value.to}`
      }
      return model.value
    })

    watch(externalModel, () => {
      ctx.emit('update:modelValue', externalModel.value)
    })

    return {input, model, edtf0Mask, mask, edtf0Rule, internalFromModel, internalToModel, externalModel}
  }
}
</script>

<style scoped>

</style>
