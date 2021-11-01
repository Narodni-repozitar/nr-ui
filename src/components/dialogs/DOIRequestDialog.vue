<template lang="pug">
q-dialog(ref="dialog" @hide="onDialogHide")
  q-card.q-dialog-plugin().bg-primary-dark
    .q-card__section.q-card__section--vert.q-dialog__title.text-white {{ $t('label.actionApprove') }}
    .q-card__section.q-card__section--vert.text-white {{ $t('message.doYRlyWnt') }} {{ $t('action.approve') }}?
    q-separator()
    .q-card__section.q-card__section--vert.text-white
      q-checkbox(v-model='doiRequested' :label="$t('action.requestDOI')" :disable="!requestable" )
    .q-card__section.q-card__section--vert.text-amber
      div(v-show="doiRequested") {{ $t('label.choosePublisher') }}
        q-card-section(v-for='(input, index) in publishersTitles' :key='index' )
          q-radio(v-model="selectedPublisher" :val="input" :label="`${input}`").text-white
    .q-card__actions.justify-end.q-card__actions--horiz.row
      button.q-btn.q-btn-item.non-selectable.no-outline.q-btn--flat.q-btn--rectangle.text-amber.q-btn--actionable.q-focusable.q-hoverable(tabindex='0' type='button' role='button' @click="hide")
        span.q-focus-helper
        span.q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row
          span.block {{ $t('action.cancel') }}
      q-btn.q-btn.q-btn-item.non-selectable.no-outline.q-btn--flat.q-btn--rectangle.text-amber.q-btn--actionable.q-focusable.q-hoverable(@click="onOKClick" :disable="!selectionCheck()" tabindex='0' type='button' role='button' data-autofocus='true')
        span.q-focus-helper(tabindex='-1' )
        span.q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row
          span.block {{ $t('action.ok') }}
</template>
<script>
import {defineComponent, ref} from 'vue'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import deepcopy from "deepcopy";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'DOIRequestDialog',
  components: {MultilingualInput},
  emits: ['ok', 'hide', ],
  props: {
    datasetLinks: Object,
    dataset: Object,
    metadata: Object,
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const {t} = useI18n()
    const model = ref(deepcopy(props.value))
    var publishers = ref(props.dataset.metadata.publisher || '')
    var publishersTitles = []
    var record = ref(props.dataset.metadata)
    var selectedPublisher = ref('')
    var doiRequested = ref(false)
    var requestable = ref(true)
    var missingValues = ref([])
    isRequestable()
    setPublishers()
    function show() {
      dialog.value.show()
    }
    function hide() {
      dialog.value.hide()
    }
    function onDialogHide() {
      ctx.emit('hide')
    }
    function selectionCheck() {
      if(!doiRequested.value){
        this.selectedPublisher = ''
        return true
      }
      else if(doiRequested.value && this.selectedPublisher !== '' ){
        return true
      }
      return false

    }
    function onOKClick() {
      var data = {}
      if (doiRequested.value) {
        data = {
          "doiRequest": {"publisher": selectedPublisher.value}
        }
      }
      ctx.emit('ok', data)
      hide()

    }
    function onCancelClick() {
      hide()
    }
    function setPublishers() {
      for (let i = 0; i < publishers.value.length; i++) {
        var publisher = publishers.value[i]['title']['en']
        if(publisher === undefined){
          publisher = publishers.value[i]['title']['cs']
        }
        if(publishersTitles.includes(publisher)){
          continue
        }
        publishersTitles.push(publisher)
      }

    }
    function isRequestable(){
      const mainTitle = record.value.titles?.filter(t => t.titleType === 'mainTitle')[0].title
      const creators = record.value.creators

      if(mainTitle === undefined){
        missingValues.value.push("Main title")
      }
      if(creators.length === 0){
        missingValues.value.push("Creators")
      }
      if(publishers.value.length === 0 ){
        missingValues.value.push("Publisher")
      }
      if(missingValues.value.length > 0){
        requestable = false
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
      doiRequested,
      selectedPublisher,
      selectionCheck,
      publishersTitles,
      setPublishers,
      requestable,
      record,
      isRequestable,
      missingValues
    }
  }
})
</script>

<style lang="sass">
</style>
