<template lang="pug">
q-select(
  v-bind="$attrs"
  v-model="model"
  use-input
  :hide-selected="false"
  hide-dropdown-icon
  :clearable="!multiple"
  :multiple="multiple"
  :input-debounce="debounce"
  :label="label"
  :options="options"
  @filter="filterFn"
  @filter-abort="abortFilterFn"
  :hint="hint"
  :placeholder="emptyModel ? translatedPlaceholder: ''"
  @update:model-value="clearText"
  @keydown="onKeyDown"
  @input="clearText"
  ref="select")
  template(v-slot:no-option)
    q-item
      q-item-section.text-secondary
        div(v-if="searchValue") {{ $t('message.noResults') }}
        div(v-else) {{ $t('message.typeAFewLetters') }}
  template(v-slot:append)
    q-btn(icon="unfold_more" flat color="primary" dense @click="showTaxonomy" :label="$t('label.showTaxonomyTree')")
  template(v-slot:option="{opt, selected, focused, itemProps, itemEvents}")
    q-item(v-bind="itemProps" v-on="itemEvents")
      term-chip(:term="opt" :taxonomy="taxonomy" color="primary")
  template(v-slot:selected-item="{opt, index, removeAtIndex}")
    term-chip(@remove="removeAtIndex(index)" :term="opt" :taxonomy="taxonomy" v-if="multiple" color="primary" removable)
</template>

<script>
import {computed, defineComponent, onMounted, ref, toRefs, watch} from 'vue'
import useTaxonomy from '@/composables/useTaxonomy'
import {useI18n} from 'vue-i18n'
import {copyValue, termOrArrayChanged} from '@/utils'
import {useQuasar} from 'quasar'
import TaxonomyInputDialog from "@/components/widgets/dialogs/TaxonomyInputDialog";
import TermChip from "@/components/widgets/taxonomy/TermChip";

const DEFAULT = {}

export default defineComponent({
  name: 'TermSelect',
  components: {TermChip},
  emits: ['update:modelValue'],
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
      default: 100
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
    const select = ref(null)

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
      return (arrayValue.value || []).filter(x => x.is_ancestor !== true)
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
        ctx.emit('update:modelValue', await convertToElasticsearch(model.value))
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
            return !x.descendants_count
          })
        }

        return update(() => {
          options.value = terms
        })
      })
    }

    function abortFilterFn() {
    }

    function showTaxonomy() {
      $q.dialog({
        component: TaxonomyInputDialog,
        componentProps: {
          leafOnly: props.leafOnly,
          taxonomy: props.taxonomy,
          title: props.selectorTitle,
          value: model.value,
          multiple: props.multiple
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

    function clearText() {
      select.value.updateInputValue('')
    }

    function openSelector() {
      showTaxonomy()
    }

    const translatedPlaceholder = computed(() => {
      if (props.placeholder !== DEFAULT) {
        return props.placeholder
      }
      return t('label.startWriting')
    })

    function convertToElasticsearch(model) {
      if (!model) {
        return []
      }
      if (!props.multiple) {
        model.value = [model.value]
      }
      return [...Object.values(model.value)]
    }

    return {
      select,
      filterFn,
      onKeyDown,
      clearText,
      openSelector,
      options,
      translatedPlaceholder,
      showTaxonomy,
      abortFilterFn,
      emptyModel,
      model,
    }
  }
})
</script>

<style lang="sass" scoped>
</style>
