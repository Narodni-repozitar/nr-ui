<template lang="pug">
q-select(
  class="q-py-sm"
  v-bind="$attrs"
  v-model="model"
  use-input
  item-aligned
  outlined
  square
  color="primary"
  :hide-selected="false"
  hide-dropdown-icon
  :multiple="multiple"
  :input-debounce="debounce"
  :label="label"
  :options="options"
  @filter="filterFn"
  @filter-abort="abortFilterFn"
  :hint="hint"
  :rules="rules"
  :placeholder="emptyModel ? translatedPlaceholder: ''"
  @update:model-value="clearText"
  @keydown="onKeyDown"
  @input="clearText"
  ref="input")
  template(v-slot:no-option)
    q-item
      q-item-section.text-primary
        div.text-negative(v-if="searchValue") {{ $t('message.noResults') }}
        div(v-else) {{ $t('message.typeAFewLetters') }}
  template(v-slot:append)
    .full-height.items-center.q-pt-xs
      cancel-button(v-if="model?.length" @click="clear" size="md")
      q-btn(
        icon="unfold_more"
        flat
        color="primary"
        dense
        @click="showTaxonomy"
        :label="$t(multiple? 'action.chooseTerms':'action.chooseTerm')")
  template(v-slot:option="{opt, selected, focused, itemProps, itemEvents}")
    q-item(v-bind="itemProps" v-on="itemEvents || {}")
      term-chip(:term="opt" :taxonomy="taxonomy" color="primary" extended)
  template(v-slot:selected-item="{opt, index, removeAtIndex}")
    term-chip(@remove="removeAtIndex(index)" :term="opt" color="primary" :removable="multiple" :extended="!multiple")
</template>

<script>
import {computed, defineComponent, onMounted, ref, toRefs, watch} from 'vue'
import useTaxonomy from '/src/composables/useTaxonomy'
import {useI18n} from 'vue-i18n'
import {copyValue, termOrArrayChanged} from '/src/utils'
import {useQuasar} from 'quasar'
import TermInputDialog from 'components/dialogs/TermInputDialog'
import TermChip from 'components/taxonomy/TermChip'
import ValidateMixin from 'src/mixins/ValidateMixin'

const DEFAULT = {}

export default defineComponent({
  name: 'TermSelect',
  mixins: [ValidateMixin],
  components: {TermChip},
  emits: ['update:modelValue', 'clear'],
  props: {
    taxonomy: String,
    multiple: {
      type: Boolean,
      default: false
    },
    leafOnly: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 500
    },
    levels: {
      type: Number,
      default: 20
    },
    label: {
      type: String,
      default: ''
    },
    hint: String,
    exclude: Array,
    placeholder: {
      type: [String, Object],
      default: () => DEFAULT
    },
    selectorTitle: String,
    elasticsearch: Boolean,
    modelValue: {
      type: [Object, Array],
      required: false
    }
  },
  setup(props, ctx) {
    const {suggest} = useTaxonomy()
    const {t} = useI18n()
    const $q = useQuasar()

    const { modelValue } = toRefs(props)
    const model = ref(null)
    const options = ref([])
    const searchValue = ref(null)
    const input = ref(null)

    const emptyModel = computed(() => {
      return !model.value || (Array.isArray(model.value) && !model.value.length)
    })

    const arrayValue = computed(() => {
      if (!modelValue.value) {
        return []
      }
      if (Array.isArray(modelValue.value)) {
        return modelValue.value
      }
      return [modelValue.value]
    })

    const leafValue = computed(() => {
      const leaf = (arrayValue.value || []).filter(x => x.is_ancestor !== true)
      if (props.multiple) {
        return leaf
      }
      return leaf.length > 1? leaf[0] : undefined
    })

    function valueChanged() {
      if (termOrArrayChanged(model.value, leafValue.value)) {
        model.value = copyValue(leafValue.value)
      }
    }

    watch(leafValue, () => {
      valueChanged()
    })

    onMounted(() => {
      if (modelValue.value) {
        valueChanged()
      }
    })

    watch(model, async () => {
      if (props.elasticsearch) {
        ctx.emit('update:modelValue', await convertToElasticsearch(model))
      } else {
        ctx.emit('update:modelValue', model.value)
      }
    })

    function filterFn(val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      searchValue.value = val
      suggest({
        code: props.taxonomy,
        filter: searchValue.value
      }).then((terms) => {
        if (props.leafOnly) {
          terms = terms.filter(x => {
            return !x.descendants_count && !props.exclude.includes(x.slug)
          })
        }

        return update(() => {
          options.value = terms
        })
      })
    }

    function abortFilterFn () {
    }

    function resetValidation () {
      input.value.resetValidation()
    }

    function showTaxonomy() {
      $q.dialog({
        component: TermInputDialog,
        componentProps: {
          leafOnly: props.leafOnly,
          taxonomy: props.taxonomy,
          title: props.selectorTitle,
          value: model.value,
          multiple: props.multiple,
          exclude: props.exclude
        }
      }).onOk((value) => {
        model.value = value
      })
    }

    function onKeyDown() {
      if (!props.multiple && model.value) {
        model.value = null
      }
    }

    function clear() {
      ctx.emit('update:modelValue', null)
      ctx.emit('clear', null)
      clearText()
    }

    function clearText() {
      input.value.updateInputValue('')
    }

    const translatedPlaceholder = computed(() => {
      if (props.placeholder !== DEFAULT) {
        return props.placeholder
      }
      return t('label.startWriting')
    })

    function convertToElasticsearch(model) {
      if (!model.value) {
        return []
      }
      if (!props.multiple) {
        model.value = [model.value]
      }
      return [...Object.values(model.value)]
    }

    return {
      input,
      filterFn,
      onKeyDown,
      clear,
      clearText,
      options,
      translatedPlaceholder,
      showTaxonomy,
      abortFilterFn,
      resetValidation,
      searchValue,
      emptyModel,
      model,
    }
  }
})
</script>

<style lang="sass" scoped>
</style>
