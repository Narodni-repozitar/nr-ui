<template lang="pug">
q-dialog.q-pa-lg.dialog-window.bg-primary-transparent(
  ref='dialog' @hide='onDialogHide'
  :maximized="maximized"
  persistent
  transition-show="slide-up"
  transition-hide="slide-down")
  q-card.q-mt-xl(v-on:keyup.enter="next")
    q-bar.bg-secondary
      q-space
      q-btn(dense color="white" flat icon="minimize" @click="maximized = false" :disable="!maximized")
      q-btn(dense color="white" flat icon="crop_square" @click="maximized = true" :disable="maximized")
      q-btn(dense color="white" flat icon="close" v-close-popup)
    q-card-section.bg-secondary.text-white(dark)
      .text-h4 {{ $t('action.attachArticle') }}
    q-card-section
      q-stepper(v-model="step" flat)
        q-step(name="1" :title="$t('label.importFromDOI')" :done="step > 1")
          doi-input(v-model="article.doi" ref="doi" :dataset="dataset"
            @resolve="articleResolved"
            @exists="onCancelClick"
            @invalid="doiInvalid")
        q-step.full-width(name="2" :title="$t('label.articleMetadata')" :done="step > 2")
          q-input(
            v-model="article.title_val"
            readonly
            :label="`${$t('label.title')}`")
          q-input(
            v-model="article.publication_year"
            readonly
            :label="`${$t('label.publicationDate')}`")
          q-input(
            v-if="article.url"
            v-model="article.url"
            readonly
            :label="`${$t('label.articleURL')}`"
          )
          .text.q-mt-md {{ $t('label.authors') }}
          q-card-section(v-for='(input,k) in authors_inputs' :key='k' )
            q-input(
              type='text'
              readonly
              :label="`${$t('label.author')} ${String(k + 1)}`"
              v-model='input.fullName')
    q-card-actions(align='right' v-if="step==='1'").q-pa-md
      q-btn.full-width(
        color='secondary'
        :disable="validatingDOI"
        :label="$t('label.importFromDOI')"
        @click='next'
        :loading="validatingDOI")
        template(v-slot:loading)
          .row.full-width.no-wrap.q-gutter-md.justify-center
            .col-auto {{ $t('message.loadingMetadata') }}
            q-spinner-puff.col-auto
    q-card-actions.q-mb-xl.q-mx-lg(align='right' v-if="step==='2'")
      q-btn.q-mb-xl.q-ml-md(
        color="primary"
        :disable="creatingArticle"
        :label="$t('label.back')" @click='back')
      q-space
      q-btn.col-auto.q-mb-xl.q-mr-lg(
        color='positive'
        padding="sm"
        size="lg"
        :disable="creatingArticle"
        :label="$t('label.createArticle')"
        @click='createArticle'
        :loading="creatingArticle")
        template(v-slot:loading)
          .row.full-width.no-wrap.q-gutter-md.justify-center
            .col-auto {{ $t('message.creatingArticle') }}
            q-spinner-puff.col-auto
</template>

<script>
import axios from 'axios'
import DOIInput from "components/controls/inputs/DOIInput";
import TermSelect from "components/controls/selects/TermSelect";
import TermListSelect from "components/controls/selects/TermListSelect";
import {defineComponent, ref} from "vue";
import useModel from "src/composables/useModel";
import useValidation from "src/composables/useValidation";
import {useI18n} from "vue-i18n";
import useNotify from "src/composables/useNotify";
import RmListItemBtn from 'components/controls/buttons/RmListItemBtn'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'ArticleMetadataDialog',
  props: {
    dataset: Object,
    datasetLinks: Object,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'hide', 'ok'],
  components: {
    'doi-input': DOIInput,
    TermSelect, TermListSelect, RmListItemBtn
  },

  setup(props, ctx) {
    const {t} = useI18n()
    const dialog = ref(null)  // nahrada za this.$refs.dialog
    const doi = ref(null) // nahrada za this.$refs.doi
    const dataRelType = ref({})
    const resourceType = ref({})
    const {onChange} = useModel(ctx, dataRelType)
    const {error, required, errorMessage} = useValidation()
    const {notifySuccess, notifyError} = useNotify()
    const maximized = ref(false)
    const $q = useQuasar()

    const k = 0
    const step = ref('1')
    const validatingDOI = ref(false)
    const creatingArticle = ref(false)
    const generated_article = ref({})
    const article = ref({
      doi: '',
      title_val: '',
      document_type: '',
      publication_year: '',
      url: ''
    })
    const authors_inputs = ref([{fullName: ''}])


    function show() {
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    function articleResolved(art) {
      validatingDOI.value = false
      generated_article.value = art
      article.value.publication_year = art.itemYear
      article.value.url = art.itemURL
      article.value.title_val = art.itemTitle
      article.value.doi = doi.value.doi.trim()

      for (let i = 0; i < art.itemCreators.length; i++) {
        if (i === 0) {
          authors_inputs.value[0].fullName = art.itemCreators[0].fullName
        } else {
          authors_inputs.value.push({fullName: art.itemCreators[i].fullName})
        }
      }
      step.value = '2'
      maximized.value = true
    }

    function doiInvalid() {
      validatingDOI.value = false
    }

    function articleCreateFailed(err) {
      console.log(err)
      notifyError(`${t('message.errorCreatingArticle')}: ${err}`)
    }

    function articleCreateSuccess(art) {
      notifySuccess(t('message.saveChangesSuccess'))
    }

    function next() {
      validatingDOI.value = true
      doi.value.validate()
    }

    function back() {
      maximized.value = false
      article.value.doi = ''
      step.value = '1'
    }

    function createArticle() {
      creatingArticle.value = true
      const datasetUrl = props.datasetLinks.self

      let relatedItem = {
        itemTitle: generated_article.value.itemTitle,
        itemCreators: generated_article.value.itemCreators,
        itemURL:  generated_article.value.itemURL,
        itemYear: generated_article.value.itemYear,
        itemPIDs: generated_article.value.itemPIDs,
        itemResourceType: generated_article.value.itemResourceType,
        itemRelationType: generated_article.value.itemRelationType
      }

      let path = ''
      if (props.dataset.metadata.relatedItems === undefined) {
        path = '/relatedItems'
        relatedItem = [relatedItem]
      } else {
        path = '/relatedItems/-'
      }
      console.log('data', relatedItem)
      axios.patch(
          datasetUrl,
          [{
            op: 'add',
            path: path,
            value: relatedItem
          }], {headers: {'Content-Type': 'application/json-patch+json'}})
          .then((res) => {
            articleCreateSuccess(res)
            hide()
          })
          .catch(err => {
            articleCreateFailed(err)
          })
          .finally(() => {
            creatingArticle.value = false
            validatingDOI.value = false
          })
    }

    function onOKClick() {
      ctx.emit('ok')
      hide()
    }

    function onCancelClick() {
      hide()
    }

    return {
      dialog,
      doi,
      step,
      authors_inputs,
      article,
      maximized,
      dataRelType,
      onChange,
      error,
      creatingArticle,
      validatingDOI,
      required,
      errorMessage,
      resourceType,
      show,
      hide,
      onDialogHide,
      articleResolved,
      doiInvalid,
      next,
      back,
      createArticle,
      onOKClick,
      onCancelClick,
    }
  }
})
</script>
<style lang="sass">
//.dialog-window
//  z-index: 7100 !important
</style>
