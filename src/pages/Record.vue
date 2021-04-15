<template lang="pug">
div.record-page
  .row.q-mt-lg
    access-icon.block(:accessRights="m.accessRights" size="64px")
    .title
      mt(:text="m.title")
  .row.q-mt-xl
    .col-3
      div ikony a tak
    .col-9
      label-block(label="Překlad názvu")
      label-block(label="Příjmení, Jméno")
      label-block(label="Datum")
      label-block(label="Jazyk")
      label-block(label="Typ dokumentu")
      label-block(label="Identifikátor díla")
      label-block(label="Vydavatel")
      label-block(label="Edice")
      label-block(label="Klíčová slova")
      pre {{ m }}
</template>


<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from "components/icons/AccessIcon";
import LabelBlock from "components/record/LabelBlock"

export default @Options({
  name: 'Record',
  props: {
    record: Object
  },
  components: {
    AccessIcon,
    LabelBlock
  }
})
class Record extends Vue {
  get m() {
    return this.record.metadata
  }
}
</script>
