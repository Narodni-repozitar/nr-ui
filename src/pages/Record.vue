<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height.record-page
  .q-mt-lg.row
    access-icon(:accessRights="accessRights" size="64px")
    .title.col
      mt(:text="mainTitle")
  .row.q-my-xl
    .col-3.q-pl-md
      .column.full-height.q-pr-lg
        rights-icon.q-mb-md.col-auto.self-start.block(v-if="rights" :rights="rights" size="128px")
        label-block.column.full-width.q-mt-lg(label="Soubory")
          .col-auto.text-left.self-start.column.q-mt-lg.cursor-pointer(
            @click="download(f)"
            v-for="f in files"
            :key="f.file_id")
            file-icon(:file="f" size="64px" :title="f.name")
            p.q-my-sm.text-primary.text-caption.wrap-anywhere {{ f.name }}
        label-block.q-mt-lg(label="Trvalý odkaz na tento záznam")
          a.block(:href="selfLink" target="_blank") {{ selfLink }}
          .text-caption.text-italic TODO: odkaz by mel byt nahrazen DOIckem, pokud existuje
        label-block.block.q-mt-lg(label="Stav záznamu")
          p {{ recordStatus }}
    .col-9
      label-block(label="Překlad názvu" v-if="Object.keys(mainTitle).length > 1")
        .block.column
          mt-languages(:text="mainTitle" exclude-current-language)
      label-block(label="Osoby")
        record-people.text-primary.text-weight-medium(:m="m")
      label-block(label="Datum")
        div.year-lang
          .row(v-for="(d, idx) in m.dates" :key="idx")
            vertical-separator(v-if="idx > 0")
            span {{ d.date }} ({{ $t(`value.dateType.${d.type}`) }})
          .row(v-if="m.dateAvailable")
            span {{ m.dateAvailable }} ({{ $t(`value.dateType.published`) }})
      label-block(:label="$t('label.dateCreated')" v-if="m.dateCreated")
        span {{ m.dateCreated }}
      label-block(:label="$t('label.dateCollected')" v-if="m.dateCollected")
        span {{ m.dateCollected }}
      label-block(label="Jazyk")
        div(v-for="(l, idx) in m.language" :key="l.links.self")
          simple-term.inline(:term="[l]")
          span(v-if="idx < m.language.length-1") ,&nbsp;
      label-block(label="Typ dokumentu")
        simple-term(:term="m.resourceType")
      label-block(label="Identifikátory díla" v-if="m.identifiers?.length")
        separated-list(:list='m.persistentIdentifiers')
          template(v-slot:default="{item}")
            span.identifier-type {{ item.scheme }}
            a(:href="`https://doi.org/${item.identifier}`" v-if="item.scheme.toLowerCase() === 'doi'")
              span.identifier-value {{ item.identifier }}
            span.identifier-value(v-else) {{ item.identifier }}
      label-block(label="Klíčová slova")
        multilingual-chip.q-mr-sm(:multilingual="kw" v-for="(kw, idx) in m.keywords" :key="idx")
      label-block(label="Abstrakt")
        mt-tabs(:text="sanitize(m.abstract) || []")
      label-block(:label="$t('label.methods')" v-if="m.methods")
        mt-tabs(:text="sanitize(m.methods) || []")
      label-block(:label="$t('label.technicalInfo')" v-if="m.technicalInfo")
        mt-tabs(:text="sanitize(m.technicalInfo) || []")
      label-block(label="Poznámka" v-if="m.notes?.length")
        separated-list(:list='m.notes')
          template(v-slot:default="{item}")
            span {{ item }}
      label-block(label="Je součástí" v-if="m.relatedItems?.length")
      separated-list(:list="m.relatedItems" double)
        template(v-slot:default="{item}")
          .row
            span.text-weight-bold.q-px-sm {{ $t('label.title') }}
            span {{ item.itemTitle }}
            vertical-separator
            span.text-weight-bold.q-px-sm {{ $t('label.authors') }}:
            span.q-px-sm(v-for="c in item.itemCreators" :key="c.fullName") {{ c.fullName }}
      label-block(label="Projekt" v-if="m.fundingReferences?.length")
        separated-list(:list='m.fundingReferences' double)
          template(v-slot:default="{item}")
            template(v-if="item.projectID")
              span.text-primary {{ item.projectID }}
              vertical-separator
            template(v-if="item.projectName")
              span {{ item.projectName }}
              vertical-separator
            simple-term(:term="[item.funder]")
      label-block(label="Práva" v-if="rights?.length")
        simple-term(:levels="1" :term="rights")
      label-block(:label="$t('label.subjectCategories')" v-if="m.subjectCategories?.length")
        separated-list(:list='m.subjectCategories' double)
          template(v-slot:default="{item}")
            simple-term( :term="[item]")
  .row.q-my-xl.full-width.justify-between
    .col-auto.column.items-start.q-mb-xl
      q-btn.col-auto(
        flat
        color="primary"
        icon="arrow_back"
        :label="$t('label.backToCollection')"
        @click="navigateToCollection()")
    .col-auto.column.items-end.text-left
  actions-sidebar(:actions="recordActions")
</template>

<script>
import ActionsSidebar from 'components/record/ActionsSidebar'
import AccessIcon from "components/icons/AccessIcon"
import RightsIcon from "components/icons/RightsIcon"
import FileIcon from 'components/icons/FileIcon'
import LabelBlock from "components/record/LabelBlock"
import RecordPeople from 'components/list/RecordPeople'
import {defineComponent} from 'vue'
import {useRouter} from 'vue-router'
import VerticalSeparator from "components/ui/VerticalSeparator";
import MultilingualChip from 'components/i18n/MultilingualChip'
import {PRIMARY_COMMUNITY_FIELD} from "src/constants";
import useRecord from "src/composables/useRecord";
import {sanitize} from "src/utils";

export default defineComponent({
  name: 'Record',
  props: {
    record: Object
  },
  components: {
    VerticalSeparator,
    MultilingualChip,
    ActionsSidebar,
    AccessIcon,
    LabelBlock,
    RightsIcon,
    RecordPeople,
    FileIcon
  },
  setup(props) {
    const {m, mainTitle, recordStatus, selfLink, recordActions, rights, accessRights, files} = useRecord(props.record)
    const router = useRouter()

    function navigateToCollection() {
      const route = {
        name: 'community-datasets',
        params: {
          communityId: m.value[PRIMARY_COMMUNITY_FIELD]
        }
      }
      return router.push(route)
    }

    function download(file) {
      window.open(`${file.url}?download`, '_blank')
    }

    return {
      m,
      recordActions,
      mainTitle,
      recordStatus,
      selfLink,
      rights,
      accessRights,
      files,
      sanitize,
      download,
      navigateToCollection
    }
  }
})
</script>
