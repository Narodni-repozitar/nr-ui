<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height.record-page
  .q-mt-lg.row
    access-icon(:accessRights="accessRights" size="64px")
    .title.col
      mt(:text="mainTitle")
    .col-auto()
      q-chip.status-chip(v-if="doiRequested")
        .text-accent.text-overline.text-bold {{$t('label.doiRequested')}}
  .row.q-my-xl
    .col-3.q-pl-md
      .column.full-height.q-pr-lg
        rights-icon.q-mb-md.col-auto.self-start.block(v-if="rights" :rights="rights" size="128px")
        label-block.column.full-width.q-mt-lg(:label="$t('section.files')")
          .col-auto.text-left.self-start.column.q-mt-lg.cursor-pointer(
            @click="download(f)"
            v-for="f in files"
            :key="f.file_id")
            file-icon(:file="f" size="64px" :title="f.name")
            p.q-my-sm.text-primary.text-caption.wrap-anywhere {{ f.name }}
        label-block.q-mt-lg(:label="$t('label.recordLink')")
          div(v-if="hasDOI")
            a.block(:href="doiUrl" target="_blank") {{ doiUrl }}
          div(v-else)
            a.block(:href="record.http.data.links.self" target="_blank") {{ record.http.data.links.self }}
        label-block.block.q-mt-lg(:label="$t('label.state')")
          p {{ recordStatus }}
    .col-9
      label-block(:label="$t('label.titleTranslation')" v-if="Object.keys(mainTitle).length > 1")
        .block.column
          mt-languages(:text="mainTitle" exclude-current-language)
      label-block(:label="$t('label.persons')")
        record-people.text-primary.text-weight-medium(:m="m")
      label-block(:label="$t('label.date')")
        div.year-lang
          .row(v-if="m.dateAvailable")
            span {{ m.dateAvailable }} ({{ $t(`value.dateType.published`) }})
      label-block(:label="$t('label.language')")
        div(v-for="(l, idx) in m.language" :key="l.links.self")
          simple-term.inline(:term="[l]")
          span(v-if="idx < m.language.length-1") ,&nbsp;
      label-block(label="Typ dokumentu")
        simple-term(:term="m.resourceType")
      label-block(:label="$t('label.recordIdentifiers')" v-if="m.identifiers?.length")
        separated-list(:list='m.persistentIdentifiers')
          template(v-slot:default="{item}")
            span.identifier-type {{ item.scheme }}
            a(:href="`https://doi.org/${item.identifier}`" v-if="item.scheme.toLowerCase() === 'doi'")
              span.identifier-value {{ item.identifier }}
            span.identifier-value(v-else) {{ item.identifier }}
      label-block(:label="$t('label.forms.keywords')")
        multilingual-chip.q-mr-sm(:multilingual="kw" v-for="(kw, idx) in m.keywords" :key="idx")
      label-block(:label="$t('label.abstract')")
        mt-tabs(:text="sanitize(m.abstract) || []")
      label-block(:label="$t('label.notes')" v-if="m.notes?.length")
        separated-list(:list='m.notes')
          template(v-slot:default="{item}")
            span {{ item }}
      label-block(:label="$t('label.isPartOf')" v-if="m.relatedItems?.length")
      separated-list(:list="m.relatedItems" double)
        template(v-slot:default="{item}")
          .row
            span.text-weight-bold.q-px-sm {{ $t('label.title') }}
            span {{ item.itemTitle }}
            vertical-separator
            span.text-weight-bold.q-px-sm {{ $t('label.authors') }}:
            span.q-px-sm(v-for="c in item.itemCreators" :key="c.fullName") {{ c.fullName }}
      label-block(:label="$t('label.project')" v-if="m.fundingReferences?.length")
        separated-list(:list='m.fundingReferences' double)
          template(v-slot:default="{item}")
            template(v-if="item.projectID")
              span.text-primary {{ item.projectID }}
              vertical-separator
            template(v-if="item.projectName")
              span {{ item.projectName }}
              vertical-separator
            simple-term(:term="[item.funder]")
      label-block(:label="$t('label.rights')" v-if="rights?.length")
        simple-term(:levels="1" :term="rights")
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
import useDOIStatus from "src/composables/useDOIStatus";

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
    const {hasNoDOI, hasDOI, doiRequested, doiUrl} = useDOIStatus(props.record.metadata)
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
      navigateToCollection,
      doiRequested,
      hasDOI,
      hasNoDOI,
      doiUrl
    }
  }
})
</script>
