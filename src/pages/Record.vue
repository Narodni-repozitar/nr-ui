<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height.record-page
  .q-mt-lg.row
    access-icon(:accessRights="[m.accessRights]" size="64px")
    .title.col
      mt(:text="m.title")
  .row.q-mt-xl
    .col-3
      div ikony a tak
    .col-9
      label-block(label="Překlad názvu")
        .block.column
          mt-languages(:text="m.title" exclude-current-language)
      label-block(label="Příjmení, Jméno")
        record-people(:m="m")
      label-block(label="Datum")
        div.year-lang
          span {{ year }}
          double-separator
          span TODO: record.updated neni mozno vzit, protoze to by byl okamzik importu
      label-block(label="Jazyk")
        simple-term(:term="m.language")
      label-block(label="Typ dokumentu")
        simple-term(:term="m.resourceType")
      label-block(label="Identifikátor díla")
        separated-list(:list='m.workIdentifiers')
          template(v-slot:default="{item}")
            span.identifier-type {{ item.key }}
            a(:href="`https://doi.org/${item.value}`" v-if="item.key === 'DOI'")
              span.identifier-value {{ item.value }}
            span.identifier-value(v-else) {{ item.value }}
      label-block(label="Vydavatel")
        separated-list(:list='m.publisher')
          template(v-slot:default="{item}")
            span {{ item }}
      label-block(label="Edice")
        separated-list(:list='m.series')
          template(v-slot:default="{item}")
            span(v-if="item.seriesTitle") {{ item.seriesTitle }}
            span(v-if="item.seriesTitle && item.seriesVolume") , 
            span(v-if="item.seriesVolume") {{ item.seriesVolume }}
      label-block(label="Klíčová slova")
        .block.col
          mt.inline(:text="m.keywords")
            template(v-slot:separator)
              vertical-separator
      label-block(label="Abstrakt")
        mt-tabs(:text="m.abstract || []")
      label-block(label="Poznámka")
        span TODO: tohle nevidim ve schematu ?
      label-block(label="Akce")
        separated-list(:list='m.events')
          template(v-slot:default="{item}")
            span {{ item.nameOriginal }}
            template(v-if='item.location')
              span , 
              simple-term(:term="item.location")
            template(v-if='item.date')
              span , {{ item.date }}
      label-block(label="Je součástí")
        span TODO: odkud brat ?
      label-block(label="Projekt")
        separated-list(:list='m.events' double)
          template(v-slot:default="{item}")
            template(v-if="item.projectID")
              span.text-primary {{ item.projectID }}
              vertical-separator
            template (v-if="item.projectName")
              span {{ item.projectName }}
              vertical-separator
            simple-term(:term="item.funder")
      label-block(label="Instituce/grantor")
        simple-term(:term="m.degreeGrantor")
      label-block(label="Podrobnosti o dostupnosti")
        mt(:text="m.accessibility")
      label-block(label="Práva")
        simple-term(:term="[m.accessRights]")
      label-block(label="Dostupnost")
        span TODO: kde vzit ?
      label-block(label="Původní záznam")
        a(:href="m.originalRecord" v-if="m.originalRecord") {{ m.originalRecord }}
        a(:href="m.recordIdentifiers.originalRecord"
          v-if="m.recordIdentifiers && m.recordIdentifiers.originalRecord"
        ) {{ m.recordIdentifiers.originalRecord }}
</template>


<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from "components/icons/AccessIcon"
import LabelBlock from "components/record/LabelBlock"
import RecordPeople from 'components/list/RecordPeople'

export default @Options({
  name: 'Record',
  props: {
    record: Object
  },
  components: {
    AccessIcon,
    LabelBlock,
    RecordPeople
  }
})
class Record extends Vue {
  get m() {
    return this.record.metadata
  }

  get year() {
    return this.m.dateIssued ? this.m.dateIssued.substr(0, 4) : undefined
  }
}
</script>
