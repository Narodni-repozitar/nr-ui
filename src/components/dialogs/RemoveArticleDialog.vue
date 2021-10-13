<template lang="pug">
q-dialog(ref="dialog" @hide="onDialogHide")
  q-card.q-dialog-plugin(style="width: 700px; max-width: 80vw;")
    q-bar.bg-secondary
      q-space
      q-btn(dense color="white" flat icon="close" v-close-popup)
    q-card-section.bg-secondary.text-white(dark)
      .text-h4 {{ $t('action.removeArticles') }}
    .q-pa-md
      .text {{ $t('hint.removeArticles') }}
        q-separator()
      .q-gutter-sm
        q-card-section(v-for='(input,k) in relCheckboxes' :key='k' )
          q-card-section()
            q-chip(square
            color="primary"
              outline
              :label ="`${input.doi}`" )
          q-checkbox(v-model='input.val' :label="`${input.title}`" )
          q-separator(inset="checkbox")
      .q-px-sm
    q-card-actions(align="right").q-pa-md.q-mr-md
      q-btn(@click="hide" flat color="grey") {{ $t('action.cancel') }}
      q-btn(@click="onOKClick" flat color="positive" icon="done" :disable="!somethingChecked()")
        .q-pl-sm {{ $t('action.ok') }}
</template>
<script>
import {defineComponent, ref} from 'vue'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import deepcopy from "deepcopy";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import axios from "axios";

export default defineComponent({
  name: 'RemoveArticleDialog',
  components: {MultilingualInput},
  emits: ['ok', 'hide'],
  props: {
    dataset: Object,
    datasetLinks: Object,
    title: String,
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const $q = useQuasar()
    const {t} = useI18n()
    const model = ref(deepcopy(props.value))
    var relItems = ref(props.dataset.metadata.relatedItems || '')
    var relCheckboxes =ref([])
    setRelItems()
    const test = ref('doi')
    function show() {
      dialog.value.show()
    }


    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }
    function somethingChecked() {
      var somethingChecked = false
      for(let i =0; i < relCheckboxes.value.length; i++){
        if(relCheckboxes.value[i].val){
          somethingChecked = true
          break
        }
      }
      return somethingChecked
    }
    function onOKClick() {
      confirm()

    }

    function onCancelClick() {
      hide()
    }

    function confirm() {
      $q.dialog({
        class: 'bg-warning',
        title: t('label.actionApprove'),
        message: `${t('message.doYRlyWnt')} ${t('label.toRemoveArticles')}?`,
        cancel: true,
        persistent: false,
        contentStyle: {zIndex: 8000}
      }).onOk(() => {
        delItems()
        hide()
      }).onCancel(() => {
        onCancelClick()
      })
    }
    async function delItems(){
      var numberOfDeletedItems = 0
      const datasetUrl = props.datasetLinks.self
      for (let i = 0; i < relItems.value.length; i++) {
        var item = relItems.value[i]
        for (let k = 0; k < relCheckboxes.value.length; k++){
          var checkbox = relCheckboxes.value[k]
          if(checkbox.val){
            for(let j= 0; j < item.itemPIDs.length; j++){
              if(item.itemPIDs[j].identifier === checkbox.doi){
                var path = '/relatedItems/'+ String(k - numberOfDeletedItems)

                if(numberOfDeletedItems + 1 === relItems.value.length){
                  path = '/relatedItems'
                }
                numberOfDeletedItems++
                await axios.patch(
                    datasetUrl,
                    [{
                      op: 'remove',
                      path: path,
                    }], {headers: {'Content-Type': 'application/json-patch+json'}})

                break
              }
            }
          }
        }
      }
    }

    function setRelItems() {
      for (let i = 0; i < relItems.value.length; i++) {
        var item = relItems.value[i]

        var doi = ''
        for(let k=0; k <item.itemPIDs.length; k++){
          var pid = item.itemPIDs[k]
          if(pid['scheme'].toUpperCase() === 'doi'.toUpperCase()){
            doi = pid['identifier']
            break
          }
        }
        var itemData = {"title": item.itemTitle, "doi": doi, 'val': false}
        relCheckboxes.value.push(itemData)
      }
    }
    return {
      dialog,
      model,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick,
      test,
      relItems,
      relCheckboxes,
      somethingChecked

    }
  }
})
</script>

<style lang="sass">
</style>
