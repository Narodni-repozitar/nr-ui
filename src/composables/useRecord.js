import {computed} from "vue";
import {DATASETS_COLLECTION_CODE, DRAFT_FIELD, PRIMARY_COMMUNITY_FIELD, STATUS_FIELD} from "src/constants";
import {date, useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import usePermissions from "src/composables/usePermissions";
import ArticleMetadataDialog from "components/dialogs/ArticleMetadataDialog";
import useFSM from "src/composables/useFsm";
import {useRouter} from "vue-router";

export default function useRecord(record) {
  const m = computed(() => {
    return record?.metadata || {}
  })

  const $q = useQuasar()
  const router = useRouter()
  const {t} = useI18n()
  const {transitions, makeTransition} = useFSM(record)
  const {canEditRecord, canAttachArticle} = usePermissions(m.value)

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
          dataset: props.record.http.data,
          datasetLinks: props.record.http.data.links
        }
      }).onOk(async () => {
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
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
          can: () => true, // transitions available are already filtered for current record/user by API
          func: () => makeTransition(t),
          ...t
        })
      })
    }
    return res.filter(act => act.can() === true)
  })

  const mainTitle = computed(() => {
    return m.value.titles.filter(t => t.titleType === 'mainTitle')[0].title
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
    return !m[STATUS_FIELD] ? t('value.facet.editing') : t(`value.facet.${m[STATUS_FIELD]}`)
  })

  const publicationYear = computed(() => {
    return m.value.dateAvailable ? date.extractDate(m.value.dateAvailable, 'YYYY-MM-DD').getFullYear() : false
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

  return {m, mainTitle, detailRoute, selfLink, recordStatus, recordActions, publicationYear, accessRights, rights, files}
}
