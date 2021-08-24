<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height.record-page
  .q-mt-lg.row
    access-icon(:accessRights="[m.accessRights]" size="64px")
    .title.col
      mt(:text="m.title")
  .row.q-my-xl
    .col-3.q-pl-md
      .column.full-height.q-pr-lg
        rights-icon.q-mb-md.col-auto.self-start.block(:rights="m.rights" size="128px")
        label-block.column.q-mt-lg(label="Soubory")
          .col-auto.text-left.self-start.column.q-mt-lg.cursor-pointer(
            @click="download(f)"
            v-for="f in m._files"
            :key="f.file_id")
            file-icon(:file="f" size="64px" :title="f.name")
            pre.text-caption {{ f.name }}
        label-block.q-mt-lg(label="Trvalý odkaz na tento záznam")
          a.block(:href="record.http.data.links.self" target="_blank") {{ record.http.data.links.self }}
          .text-caption.text-italic TODO: odkaz by mel byt nahrazen DOIckem, pokud existuje
    .col-9
      label-block(label="Překlad názvu" v-if="Object.keys(m.title).length > 1")
        .block.column
          mt-languages(:text="m.title" exclude-current-language)
      label-block(label="Osoby")
        record-people.text-primary.text-weight-medium(:m="m")
      label-block(label="Datum")
        div.year-lang
          div(v-for="(d, idx) in m.dates" :key="idx")
            vertical-separator(v-if="idx > 0")
            span {{ d.date }} ({{ $t(`value.dateType.${d.type}`) }})
      label-block(label="Jazyk")
        div(v-for="(l, idx) in m.languages" :key="l.links.self")
          simple-term.inline(:term="[l]")
          span(v-if="idx < m.languages.length-1") ,&nbsp;
      label-block(label="Typ dokumentu")
        simple-term(:term="m.resource_type.type")
      label-block(label="Identifikátory díla" v-if="m.identifiers?.length")
        separated-list(:list='m.identifiers')
          template(v-slot:default="{item}")
            span.identifier-type {{ item.key }}
            a(:href="`https://doi.org/${item.value}`" v-if="item.key === 'DOI'")
              span.identifier-value {{ item.value }}
            span.identifier-value(v-else) {{ item.value }}
      label-block(label="Vydavatel")
        separated-list(:list='[m.publisher]')
          template(v-slot:default="{item}")
            span {{ item }}
      label-block(label="Klíčová slova")
        .block.col
          span(v-for="(kw, idx) in m.keywords" :key="idx")
            vertical-separator(v-if="idx>0")
            span {{ kw }}
      label-block(label="Abstrakt")
        mt-tabs(:text="sanitize(m.abstract) || []")
      label-block(label="Poznámka" v-if="m.notes?.length")
        separated-list(:list='m.notes')
          template(v-slot:default="{item}")
            span {{ item }}
      label-block(label="Akce" v-if="m.events?.length")
        separated-list(:list='m.events')
          template(v-slot:default="{item}")
            span {{ item.nameOriginal }}
            template(v-if='item.location')
              span , 
              simple-term(:term="item.location")
            template(v-if='item.date')
              span , {{ item.date }}
      label-block(label="Je součástí" v-if="m.relatedIdentifiers?.length")
        span TODO: odkud brat ?
      label-block(label="Projekt" v-if="m.events?.length")
        separated-list(:list='m.events' double)
          template(v-slot:default="{item}")
            template(v-if="item.projectID")
              span.text-primary {{ item.projectID }}
              vertical-separator
            template (v-if="item.projectName")
              span {{ item.projectName }}
              vertical-separator
            simple-term(:term="item.funder")
      label-block(label="Instituce/grantor" v-if="m.degreeGrantor")
        simple-term(:term="m.degreeGrantor")
      label-block(label="Podrobnosti o dostupnosti" v-if="m.accessibility")
        mt(:text="m.accessibility")
      label-block(label="Práva" v-if="m.rights?.length")
        simple-term(:term="m.rights")
      label-block(label="Dostupnost")
        span TODO: kde vzit ?
      label-block(label="Původní záznam" v-if="m.originalRecord")
        a(:href="m.originalRecord" v-if="m.originalRecord") {{ m.originalRecord }}
        a(:href="m.recordIdentifiers.originalRecord"
          v-if="m.recordIdentifiers && m.recordIdentifiers.originalRecord"
        ) {{ m.recordIdentifiers.originalRecord }}
  .row.q-my-xl.full-width.justify-between
    .col-auto.column.items-start
      q-btn.col-auto(flat color="primary" icon="arrow_back" label="Předchozí záznam")
      q-btn.col-auto(flat color="primary" icon="arrow_back" label="Zpět na výsledky vyhledávání" @click="$router.back()")
    .col-auto.column.items-end.text-left
      q-btn(flat color="primary" icon-right="arrow_forward" label="Další záznam")
  actions-sidebar(:actions="recordActions")
</template>

<script>
import ActionsSidebar from 'components/record/ActionsSidebar'
import AccessIcon from "components/icons/AccessIcon"
import RightsIcon from "components/icons/RightsIcon"
import FileIcon from 'components/icons/FileIcon'
import LabelBlock from "components/record/LabelBlock"
import RecordPeople from 'components/list/RecordPeople'
import sanitizeHtml from 'sanitize-html'
import {STATE_APPROVED, STATE_PUBLISHED} from 'src/constants'
import {computed, defineComponent, ref} from 'vue'
import useAuth from 'src/composables/useAuth'
import {useRouter} from 'vue-router'
import useCollection from 'src/composables/useCollection'
import {useQuasar} from 'quasar'
import NewArticleDialog from 'components/dialogs/NewArticleDialog'
import useFSM from 'src/composables/useFsm'

export default defineComponent({
  name: 'Record',
  props: {
    record: Object
  },
  components: {
    ActionsSidebar,
    AccessIcon,
    LabelBlock,
    RightsIcon,
    RecordPeople,
    FileIcon
  },
  setup (props) {
    const $q = useQuasar()
    const {authenticated} = useAuth()
    const router = useRouter()
    const {isDatasets} = useCollection()
    const {transitions, makeTransition} = useFSM(props.record)

    const m = computed(() => props.record.metadata)
    const year = computed(() => m.value.dateIssued ? m.value.dateIssued.substr(0, 4) : undefined)

    const canEdit = computed(() => {
      // TODO: check also if user is record owner or can edit community records
      return ![STATE_APPROVED, STATE_PUBLISHED].includes(props.record.metadata.state) && authenticated.value
    })

    const EDIT_ACTION ={
      id: 'edit',
      label: 'action.edit',
      icon: 'edit',
      func: () => {
        router.push({name: 'edit-record'})
      },
      can: () => canEdit.value
    }

    const ATTACH_ARTICLE ={
      id: 'attach_article',
      label: 'action.attachArticle',
      icon: 'link',
      can: () => canEdit.value && isDatasets.value,
      func: () => {
        $q.dialog({
          component: NewArticleDialog,
          // Pass current dataset object to dialog
          componentProps: {
            dataset: props.record.http.data,
            datasetLinks: props.record.http.data.links
          }
        }).onOk(async () => {
        }).onCancel(() => {
        }).onDismiss(() => {
        })}
    }

    const recordActions = computed(() => {
      const res = [
        EDIT_ACTION,
        ATTACH_ARTICLE
      ]

      if (transitions.value.length) {
        transitions.value.forEach(t => {
          res.push({
            id: t.code,
            can: () => true, // transitions available are already filtered for current record/user
            func: () => makeTransition(t),
            ...t
          })
        })
      }
      return res.filter(act => act.can() === true)
    })

    function sanitize (value) {
      Object.keys(value).map(function(key, index) {
        value[key] = sanitizeHtml(value[key], {allowedTags: []})
      })
      return value
    }

    function download (file) {
      window.open(`${file.url}?download`, '_blank')
    }

    return {m, year, recordActions, sanitize, download}
  }
})
</script>
