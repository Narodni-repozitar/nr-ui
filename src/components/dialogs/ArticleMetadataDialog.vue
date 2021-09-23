<template lang="pug">
q-dialog.q-pa-lg.dialog-window.bg-primary-transparent(
  ref='dialog' @hide='onDialogHide'
  :maximized="maximized"
  persistent
  transition-show="slide-up"
  transition-hide="slide-down")
  q-card.q-mt-xl
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
          doi-input(v-model="article.doi" ref="doi"
            @resolve="articleResolved"
            @invalid="doiInvalid")
        q-step.full-width(name="2" :title="$t('label.articleMetadata')" :done="step > 2")
          q-input(v-model="article.title_val" label="Title value *" :error="titleError" error-message="Title can't be empty" @input="titleError=false")


          q-field.no-label-float.row.fit(
            :error="error"
            :error-message="errorMessage"
            readonly
            borderless
            :label="label")
            template(v-slot:control)
              term-select.col-12.q-px-none.no-outline(
                autofocus
                ref="organization"
                v-bind="$attrs"
                v-model="dataRelType"
                taxonomy="itemRelationType"
                :elasticsearch="false"
                :rules="[required($t('error.validation.required'))]"
                label="Related item type"
                @update:model-value="onChange")
          q-field.no-label-float.row.fit(
            :error="error"
            :error-message="errorMessage"
            readonly
            borderless
            :label="label")
            term-select.col-12.q-px-none.no-outline(
              autofocus
              ref="organization"
              v-bind="$attrs"
              v-model="resourceType"
              taxonomy="resourceType"
              :elasticsearch="false"
              :rules="[required($t('error.validation.required'))]"
              :label="$t('label.resourceType')"
              @update:model-value="onChange")

          q-input(v-model="article.document_type" label="Document type *" :error="doctypeError" error-message="Document type can't be empty" @input="doctypeError=false")
          q-input(v-model="article.publication_year" type="number" label="Publication year *" :error="yearError" error-message="Publication year is required and must be valid year" @input="yearError=false")
          .text {{ $t('label.authors') }} *
          q-card-section(v-for='(input,k) in authors_inputs' :key='k' )
            q-input(
              type='text'
              label="Author"
              :label='String(k + 1)'
              v-model='input.full_name'
              :error="authorError[k]"
              error-message="Authors name can't be empty"
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
import {ref} from "vue";
import deepcopy from "deepcopy";
import useModel from "src/composables/useModel";
import useValidation from "src/composables/useValidation";

export default {
  props: {
    dataset: Object,
    datasetLinks: Object,
    modelValue: {
      type: String,
      default: () => ''
    }
  },
  emits: ['update:modelValue'],
  components: {
    'doi-input': DOIInput,
    TermSelect, TermListSelect
  },
  setup (props,ctx){
    const dataRelType = ref(deepcopy(props.modelValue))
    const resourceType = ref(deepcopy(props.modelValue))
    const {onChange} = useModel(ctx, dataRelType)
    const {error, required, errorMessage} = useValidation()
    return {dataRelType, onChange, error, required, errorMessage, resourceType}

  },
  data() {
    return {
      maximized: false,
      k: 0,
      step: '1',
      validatingDOI: false,
      creatingArticle: false,
      authorError: [false],
      generated_article: {},
      article: {
        doi: '',
        title_val: '',
        document_type: '',
        publication_year: ''
      },
      authors_inputs: [{full_name: ''}],
      titleError: false,
      titleLangError: false,
      doctypeError: false,
      yearError: false,
      communityId: this.$route.params.communityId
    }
  },

  methods: {

    validate() {
      console.log(this.dataset)
      for (var k = 0; k < this.authors_inputs.length; k++) {
        if (this.authors_inputs[k].full_name === '') {
          this.authorError[k] = true
        }
      }
      if (this.article.title_val === '') {
        this.titleError = true
      }
      if (this.article.document_type === '') {
        this.doctypeError = true
      }
      const langRegex = /^([a-z][a-z])$|^([a-z][a-z]-[a-z][a-z])$|^_$/

      if (this.article.publication_year === '' || isNaN(this.article.publication_year)) {
        this.yearError = true
      }
    },
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    addAuthor() {
      this.authors_inputs.push({full_name: ''})
      this.authorError.push(false)
    },

    removeAuthor(index) {
      const lastValue = this.authors_inputs.length - (index + 1)
      this.authors_inputs.splice(lastValue, 1)

      const lastErrorValue = this.authorError.length - (index + 1)
      this.authorError.splice(lastErrorValue, 1)
    },

    articleResolved(article) {
      console.log('article resolved from DOI', article)
      this.validatingDOI = false
      this.generated_article = article
      this.article.document_type = article.document_type
      this.article.publication_year = article.itemYear

      this.article.title_val = article.itemTitle
      this.article.doi = this.$refs.doi.doi


      for (let i = 0; i < article.itemCreators.length; i++) {
        if (i === 0) {
          this.authors_inputs[0].full_name = article.itemCreators[0].full_name
        } else {
          this.authors_inputs.push({full_name: article.itemCreators[i].full_name})
          this.authorError.push(false)
        }
      }
      this.step = '2'
      this.maximized = true
    },

    doiInvalid() {
      this.validatingDOI = false
    },

    articleCreateFailed(err) {
      console.log(err)
      this.$q.notify({
        message: this.$t('message.errorCreatingArticle'),
        icon: 'announcement',
        color: 'negative'
      })
    },

    next() {
      this.validatingDOI = true
      this.titleError = false
      this.doctypeError = false
      this.yearError = false
      this.$refs.doi.validate()
    },
    back() {
      this.maximized = false
      this.step = '1'
    },
    createArticle() {
      this.creatingArticle = true
      this.titleError = false
      this.doctypeError = false
      this.yearError = false
      for (var k = 0; k < this.authorError.length; k++) {
        this.authorError[k] = false
      }
      this.validate()
      let authorErr = false
      for (k = 0; k < this.authorError.length; k++) {
        if (this.authorError[k] === true) {
          authorErr = true
          break
        }
      }
      if (this.titleError || authorErr || this.doctypeError || this.yearError) { // if errors in validation
        // TODO(alzpeta): show error to user using Quasar Notify plugin
        this.creatingArticle = false
      } else {

          const datasetUrl = this.datasetLinks.self

          this.updateArticle() // set changes
          console.log("jdeme tvorit", this.generated_article)
          // this.updateDatasetArray(this.generated_article, this.dataset) // set datasets

          var relatedItem = {
            itemTitle: this.generated_article.itemTitle,
            itemCreators: this.generated_article.itemCreators,
            itemURL: this.generated_article.itemURL[0], //todo pridat url
            itemYear: this.generated_article.itemYear,
            itemPIDs: [{identifier: this.article.doi, scheme: "DOI"}],
            itemRelationType: this.dataRelType,
            itemResourceType: this.resourceType
          }
          var path = ''
          console.log(relatedItem)
          if(this.dataset.metadata.relatedItems === undefined){
            path = '/relatedItems'
            relatedItem = [relatedItem]
          }
          else {
            path = '/relatedItems/-'
          }
          axios.patch(
              //datasetUrl,
              datasetUrl,
            [{
              op: 'add',
              path: path,
              value: relatedItem
            }], {headers: {'Content-Type': 'application/json-patch+json'}})
            .then(() => {
              this.creatingArticle = false
              this.validatingDOI = false

            })

        this.hide()
      }
    },
    updateArticle() {

      this.generated_article.itemTitle = this.article.title_val
      this.generated_article.itemCreators = this.authors_inputs
      this.generated_article.document_type = this.article.document_type
      this.generated_article.itemYear = this.article.publication_year
    },
    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    }
  }
}
</script>
<style lang="sass">
//.dialog-window
//  z-index: 7100 !important
</style>
