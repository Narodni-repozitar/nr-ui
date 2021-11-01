import {computed} from 'vue'


export default function useDOIStatus(metadata) {
  const doiStatus = computed(() => {
    if(metadata['oarepo:doirequest'] !== undefined){
      return 'doi_requested'
    }
    for(var identifier in metadata['persistentIdentifiers']) {
      var status = metadata['persistentIdentifiers'][identifier]['status'];
      var scheme = metadata['persistentIdentifiers'][identifier]['scheme'];
      if(status === 'registered' && scheme.toUpperCase() === 'DOI') {
        return 'doi_registered'
      }
    }
    return 'no_doi'
  })

  const hasDOI = computed(() => {
    if(doiStatus.value === 'doi_registered'){
      return true
    }
    return false
  })

  const doiRequested = computed(() => {

    if(doiStatus.value === 'doi_requested'){
      return true
    }
    return false
  })

  const hasNoDOI = computed(() => {
    if(doiStatus.value === 'no_doi'){
      return true
    }
    return false
  })

  const doi= computed(() => {
    for(var identifier in metadata['persistentIdentifiers']) {
      var status = metadata['persistentIdentifiers'][identifier]['status'];
      var scheme = metadata['persistentIdentifiers'][identifier]['scheme'];
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
