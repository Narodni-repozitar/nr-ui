import {computed} from "vue";
import {DATASETS_COLLECTION_CODE, DRAFT_FIELD, PRIMARY_COMMUNITY_FIELD, STATUS_FIELD} from "src/constants";
import {date, useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import usePermissions from "src/composables/usePermissions";
import ArticleMetadataDialog from "components/dialogs/ArticleMetadataDialog";
import useFSM from "src/composables/useFsm";
import {useRouter} from "vue-router";
import RemoveArticleDialog from "components/dialogs/RemoveArticleDialog";

export default function useRecord(record) {
  const m = computed(() => {
    return record?.metadata || {}
  })

  const $q = useQuasar()
  const router = useRouter()
  const {t} = useI18n()
  const {transitions, makeTransition} = useFSM(record)
  const {canEditRecord, canAttachArticle} = usePermissions(m)

  const EDIT_ACTION = {
    id: 'edit',
    label: 'action.edit',
    icon: 'edit',
    func: () => {
      router.push({name: 'edit-record'})
    },
    can: () => canEditRecord.value
  }

  const ATTACH_ARTICLE = {
    id: 'attach_article',
    label: 'action.attachArticle',
    icon: 'link',
    can: () => canAttachArticle.value,
    func: () => {
      $q.dialog({
        component: ArticleMetadataDialog,
        // Pass current dataset object to dialog
        componentProps: {
          dataset: record?.http?.data,
          datasetLinks: record?.http?.data?.links
        }
      }).onOk(async () => {
        await record.http.reload({keepPrevious: false})
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
  }

  const REMOVE_ARTICLE = {
    id: 'remove_article',
    label: 'action.removeArticles',
    icon: 'remove',
    can: () => canAttachArticle.value && m.value.relatedItems?.length > 0,
    func: () => {
      $q.dialog({
        component: RemoveArticleDialog,
        // Pass current dataset object to dialog
        componentProps: {
          dataset: record?.http?.data,
          datasetLinks: record?.http?.data?.links
        }
      }).onOk(async () => {
        await record.http.reload({keepPrevious: false})
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
  }
  const DOWNLOAD_ACTION = {
    id: 'download',
    label: 'action.downloadJson',
    icon: 'download',
    func: () => {
      var link = selfLink.value + '?download'
      window.open(link, '_blank')
    },
    can: () => true
  }

  const recordActions = computed(() => {
    const res = [
      EDIT_ACTION,
      ATTACH_ARTICLE,
      REMOVE_ARTICLE,
      DOWNLOAD_ACTION
    ]

    if (transitions.value.length) {
      transitions.value.forEach(t => {
        res.push({
          id: t.code,
          can: () => true, // transitions available are already filtered for current record/user by API
          func: () => makeTransition(t),
          ...t
        })
      })
    }
    return res.filter(act => act.can() === true)
  })

  function getTitles(titleType) {
    return m.value.titles.filter(t => t.titleType === titleType).map(t => t.title)
  }

  const mainTitle = computed(() => {
    return getTitles('mainTitle')[0]
  })

  const subtitles = computed(() => {
    return getTitles('subtitle')
  })

  const detailRoute = computed(() => {
    return {
      name: m.value[DRAFT_FIELD] ? 'record' : 'published-record',
      params: {
        communityId: m.value[PRIMARY_COMMUNITY_FIELD],
        model: DATASETS_COLLECTION_CODE,
        recordId: m.value.InvenioID
      }
    }
  })

  const selfLink = computed(() => {
    return record.http.data.links.self
  })

  const recordStatus = computed(() => {
    return !m.value[STATUS_FIELD] ? t('value.facet.editing') : t(`value.facet.${m.value[STATUS_FIELD]}`)
  })

  const publicationYear = computed(() => {
    return m.value.dateAvailable ? m.value.dateAvailable.slice(0, 4) : false
  })

  const accessRights = computed(() => {
    return m.value.accessRights
  })

  const rights = computed(() => {
    return m.value.rights
  })

  const files = computed(() => {
    return m.value._files
  })

  return {m, mainTitle, subtitles, detailRoute, selfLink, recordStatus, recordActions, publicationYear, accessRights, rights, files}
}
