import {computed} from "vue";
import useNeeds from "src/composables/useNeeds";
import useCollection from "src/composables/useCollection";
import {STATE_EDITING} from "src/constants";

export default function usePermissions(record) {
  const {isDatasets} = useCollection()
  const {needEditableState, needOwner, needRole, needStates} = useNeeds(record)

  const canEditRecord = computed(() => {
    return needEditableState.value && (needOwner.value && (needStates([STATE_EDITING, undefined]))) // TODO: || canEditCommunityRecords.value)
  })

  const canEditCommunityRecords = computed(() => {
    return needRole('curator')
  })

  const canAttachArticle = computed(() => {
    return canEditRecord.value && isDatasets.value
  })

  return {canEditRecord, canAttachArticle}
}
