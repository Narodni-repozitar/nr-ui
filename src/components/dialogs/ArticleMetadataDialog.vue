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
            :label="`${$t('label.title')} *`"
            :error="titleError"
            :error-message="$t('error.validation.required')"
            @input="titleError=false")
          q-input(
            v-model="article.publication_year"
            type="number"
            :label="`${$t('label.publicationDate')} *`"
            :error="yearError"
            :error-message="$t('error.validation.required')"
            @input="yearError=false")
          q-field.no-label-float.row.fit(
            :error="error"
            :error-message="errorMessage"
            readonly
            borderless)
            template(v-slot:control)
              term-select.col-12.q-px-none.no-outline(
                autofocus
                ref="itemRelationType"
                v-model="dataRelType"
                taxonomy="itemRelationType"
                :elasticsearch="false"
                :rules="[required($t('error.validation.required'))]"
                :label="`${$t('label.itemRelationType')} *`"
                @update:model-value="onChange")
          q-field.no-label-float.row.fit(
            :error="error"
            :error-message="errorMessage"
            readonly
            borderless)
            term-select.col-12.q-px-none.no-outline(
              ref="itemResourceType"
              v-model="resourceType"
              taxonomy="resourceType"
              :elasticsearch="false"
              :hint="$t('hint.resolvedDOIValue', {type: article.document_type})"
              :rules="[required($t('error.validation.required'))]"
              :label="`${$t('label.relatedItemType')} *`"
              @update:model-value="onChange")
          .text.q-mt-md {{ $t('label.authors') }} *
          q-card-section(v-for='(input,k) in authors_inputs' :key='k' )
            q-input(
              type='text'
              :label="`${$t('label.author')} ${String(k + 1)}`"
              v-model='input.full_name'
              :error="authorError[k]"
              :error-message="$t('error.validation.required')"
              @input="authorError[k]=false")
          q-btn(:label="$t('action.addAuthor')" flat color="positive" icon="add" @click="addAuthor(k)")
            q-space
          q-btn(
            :label="$t('action.removeAuthor')"
            flat color="negative"
            @click="removeAuthor(k)"
            icon="remove"
            v-show='authors_inputs.length > 1')
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
        color='grey'
        flat
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

export default defineComponent({
  name: 'ArticleMetadataDialog',
  props: {
    dataset: Object,
    datasetLinks: Object
  },
  emits: ['update:modelValue', 'hide', 'ok'],
  components: {
    'doi-input': DOIInput,
    TermSelect, TermListSelect
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
    const k = 0
    const step = ref('1')
    const validatingDOI = ref(false)
    const creatingArticle = ref(false)
    const authorError = ref([false])
    const generated_article = ref({})
    const article = ref({
      doi: '',
      title_val: '',
      document_type: '',
      publication_year: '',
    })
    const authors_inputs = ref([{full_name: ''}])
    const titleError = ref(false)
    const restypeError = ref(false)
    const itemtypeError = ref(false)
    const yearError = ref(false)

    function validate() {
      for (let k = 0; k < authors_inputs.value.length; k++) {
        if (authors_inputs.value[k].full_name === '') {
          authorError.value[k] = true
        }
      }
      if (article.value.title_val === '') {
        titleError.value = true
      }
      if (dataRelType.value === "") {
        itemtypeError.value = true
      }
      if (resourceType.value === "") {
        restypeError.value = true
      }

      if (article.value.publication_year === '' || isNaN(article.value.publication_year)) {
        yearError.value = true
      }
    }

    function show() {
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    function addAuthor() {
      authors_inputs.value.push({full_name: ''})
      authorError.value.push(false)
    }

    function removeAuthor(index) {
      const lastValue = authors_inputs.value.length - (index + 1)
      authors_inputs.value.splice(lastValue, 1)

      const lastErrorValue = authorError.value.length - (index + 1)
      authorError.value.splice(lastErrorValue, 1)
    }

    function articleResolved(art) {
      validatingDOI.value = false
      generated_article.value = art
      article.value.document_type = art.document_type
      article.value.publication_year = art.itemYear

      article.value.title_val = art.itemTitle
      article.value.doi = doi.value.doi.trim()

      for (let i = 0; i < art.itemCreators.length; i++) {
        if (i === 0) {
          authors_inputs.value[0].full_name = art.itemCreators[0].full_name
        } else {
          authors_inputs.value.push({full_name: art.itemCreators[i].full_name})
          authorError.value.push(false)
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

    function resetValidation() {
      titleError.value = false
      yearError.value = false
      restypeError.value = false
      itemtypeError.value = false
    }

    function next() {
      validatingDOI.value = true
      resetValidation()
      doi.value.validate()
    }

    function back() {
      maximized.value = false
      step.value = '1'
    }

    function createArticle() {
      creatingArticle.value = true
      resetValidation()

      for (let k = 0; k < authorError.value.length; k++) {
        authorError.value[k] = false
      }

      validate()

      let authorErr = false
      for (let k = 0; k < authorError.value.length; k++) {
        if (authorError.value[k] === true) {
          authorErr = true
          break
        }
      }
      if (titleError.value || authorErr || itemtypeError.value || yearError.value || restypeError.value) { // if errors in validation
        // TODO(alzpeta): show error to user using Quasar Notify plugin
        creatingArticle.value = false
      } else {
        const datasetUrl = props.datasetLinks.self

        updateArticle() // set changes

        console.log(generated_article.value)

        let relatedItem = {
          itemTitle: generated_article.value.itemTitle,
          itemCreators: generated_article.value.itemCreators,
          itemURL:  generated_article.value.itemURL,
          itemYear: generated_article.value.itemYear,
          itemPIDs: generated_article.value.itemPIDs,
          itemRelationType: dataRelType.value,
          itemResourceType: resourceType.value
        }

        let path = ''
        if (props.dataset.metadata.relatedItems === undefined) {
          path = '/relatedItems'
          relatedItem = [relatedItem]
        } else {
          path = '/relatedItems/-'
        }

        console.log('data ', relatedItem)

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
    }

    function updateArticle() {
      console.log(article.value)
      generated_article.value = {
        ...generated_article.value,
        itemTitle: article.value.title_val,
        itemCreators: authors_inputs.value,
        document_type: article.value.document_type,
        itemYear: article.value.publication_year
      }
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
      authorError,
      titleError,
      yearError,
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
      validate,
      show,
      hide,
      onDialogHide,
      addAuthor,
      removeAuthor,
      articleResolved,
      doiInvalid,
      next,
      back,
      createArticle,
      onOKClick,
      onCancelClick
    }
  }
})
</script>
<style lang="sass">
//.dialog-window
//  z-index: 7100 !important
</style>
