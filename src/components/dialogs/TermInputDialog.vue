<template lang="pug">
q-dialog.taxonomy(ref="dialog" @hide="onDialogHide")
  q-card.q-dialog-plugin(style="width: 700px; max-width: 80vw;")
    q-card-section.q-ml-md.q-mt-md.q-pb-none(v-if="title")
      .text-h5 {{ title }}
    q-card-section
      taxonomy-tree(
        :exclude="exclude"
        :leaf-only="leafOnly"
        :taxonomy="taxonomy"
        :start-expanded="true"
        :tree-options="opts"
        ref="tree"
        v-model="selected"
        :multiple="multiple"
        @select="onOKClick"
        :initial-size="10")
    q-card-section(v-if="multiple")
      .row.items-end.q-gutter-md.q-mx-md
        q-field.q-mr-md.col(:label="$t('label.selectedTerms')" readonly stack-label)
          template(v-slot:control)
            .row.items-end.q-gutter-sm
              term-chip.q-mt-md(
                v-for="term in (selected || [])"
                :key="term.links.self"
                :term="term"
                :taxonomy="taxonomy"
                removable
                @remove="valueUnselected(term)")
    q-card-actions(align="right").q-pa-md.q-mr-md
      q-btn(@click="hide" flat color="grey") {{ $t('action.cancel') }}
      q-btn(@click="onOKClick" flat color="positive" icon="done" v-if="multiple")
        .q-pl-sm {{ $t('action.ok') }}
</template>
<script>
import {defineComponent, reactive, ref} from 'vue'
import TermChip from 'components/taxonomy/TermChip'
import TaxonomyTree from 'components/taxonomy/TaxonomyTree'

export default defineComponent({
  name: 'TermInputDialog',
  components: {TermChip, TaxonomyTree},
  emits: ['ok', 'hide'],
  props: {
    exclude: Array,
    multiple: {
      type: Boolean,
      default: false
    },
    leafOnly: {
      type: Boolean,
      default: false
    },
    taxonomy: String,
    title: String,
    value: [Array, Object],
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const tree = ref(null)
    const selected = ref([])
    const opts = reactive({
      checkbox: true,
      autoCheckChildren: false
    })

    function show() {
      if (props.multiple) {
        selected.value = props.value || []
      } else if (props.value) {
        selected.value = props.value
      }
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    function onOKClick() {
      ctx.emit('ok', selected.value)
      hide()
    }

    function onCancelClick() {
      hide()
    }

    return {
      dialog,
      tree,
      selected,
      opts,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick
    }
  }
})
</script>

<style lang="sass">
</style>
