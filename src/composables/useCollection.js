import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {DATASETS_COLLECTION_CODE} from 'src/constants'

export default function useCollection() {
    const route = useRoute()

    const isDatasets = computed(() => {
        return route.params.model === DATASETS_COLLECTION_CODE
    })

    return {isDatasets, model: ref(route.params.model)}
}
