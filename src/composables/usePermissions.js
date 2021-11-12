import {computed} from "vue";
import useNeeds from "src/composables/useNeeds";
import useCollection from "src/composables/useCollection";
import {STATE_EDITING} from "src/constants";
import useAuth from "src/composables/useAuth";

export default function usePermissions(record) {
  const {isDatasets} = useCollection()
  const {currentUserCommunities} = useAuth()
  const {needEditableState, needOwner, needRole, needStates, needCommunityRole} = useNeeds(record)

  const communitiesMember = computed(() => {
    return currentUserCommunities.value.filter(c => canCreateRecord(c.id))
  })

  const canCreateRecord = (communityId) => {
    return needCommunityRole(communityId, 'member')
  }

  const canEditRecord = computed(() => {
    return needEditableState.value && (needOwner.value && (needStates([STATE_EDITING, undefined]))) // TODO: || canEditCommunityRecords.value)
  })

  const canEditCommunityRecords = computed(() => {
    return needRole('curator')
  })

  const canAttachArticle = computed(() => {
    return canEditRecord.value && isDatasets.value
  })

  return {canEditRecord, canAttachArticle, canCreateRecord, communitiesMember}
}
