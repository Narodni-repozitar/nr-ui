import {computed} from 'vue'


export default function useDOIStatus(metadata) {
  const doiStatus = computed(() => {
    if (doi.value !== null) {
      return 'doi_registered'
    }
    if (metadata['oarepo:doirequest'] !== undefined){
      return 'doi_requested'
    }
    return 'no_doi'
  })

  const hasDOI = computed(() => {
    return doiStatus.value === 'doi_registered';
  })

  const doiRequested = computed(() => {

    if(doiStatus.value === 'doi_requested'){
      return true
    }
    return false
  })

  const hasNoDOI = computed(() => {
    return doiStatus.value === 'no_doi';
  })

  const doi = computed(() => {
    for(let identifier in metadata['persistentIdentifiers']) {
      const status = metadata['persistentIdentifiers'][identifier]['status'];
      const scheme = metadata['persistentIdentifiers'][identifier]['scheme'];
      if (status === 'registered' && scheme.toUpperCase() === 'DOI') {
        return metadata['persistentIdentifiers'][identifier]['identifier']
      }
    }
    return null
  })

  const doiUrl = computed(() => {
    if(doiStatus.value === 'doi_registered'){
      const doi_first = doi.value.split('/')[0]
      const doi_second = doi.value.split('/')[1]
      return 'https://doi.test.datacite.org/dois/' + doi_first + '%2F' + doi_second // temporary for test purposes
    }
    return null
  })



  return {doiStatus, hasDOI, hasNoDOI, doiRequested, doi, doiUrl }
}
