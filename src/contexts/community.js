import {defineContext} from 'vue-context-composition'
import {computed, readonly, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {axios} from '/src/boot/axios'
import deepcopy from "deepcopy";

const communities = ref([])
const loading = ref(false)

export const community = defineContext(() => {
  const route = useRoute()
  const router = useRouter()

  function loadCommunities() {
    loading.value = true
    axios.get('/communities/')
      .then(resp => {
        communities.value = resp.data
      }).finally(() => {
      loading.value = false
    })
  }

  async function setCommunity(communityId) {
    const routeParams = deepcopy(route.params)
    let routeName = route.name


    if (communityId && route.name === 'datasets' ) {
      routeName = 'community-datasets'
    }
    if (!communityId && route.name === 'community-datasets') {
      delete routeParams.communityId
      return await router.push({
        name: 'datasets',
        params: {
          ...routeParams,
        }
      })
    }

    return await router.push({
      name: routeName,
      params: {
        ...routeParams,
        communityId: communityId,
      }
    })
  }

  const communityId = computed(() => {
    return route.params.communityId
  })

  const currentCommunity = computed(() => {
    return communities.value?.find((c) => c.id === communityId.value)
  })

  function getCommunity(communityId) {
    return communities.value?.find(c => c.id = communityId)
  }

  return {
    loadCommunities,
    setCommunity,
    getCommunity,
    communities: readonly(communities),
    communityId: readonly(communityId),
    currentCommunity: readonly(currentCommunity),
    communitiesLoading: readonly(loading)
  }
})
