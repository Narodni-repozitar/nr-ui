export const loginOptions = {
  loginUrl: '/oauth/login/eduid/',
  logoutUrl: '/logout',
  logoutMethod: 'POST',
  completeUrl: '/oauth/complete/',
  stateUrl: '/oauth/state/'
}


export const PRIMARY_COMMUNITY_FIELD = 'oarepo:primaryCommunity'

export const DATASETS_COLLECTION_CODE = 'datasets'
export const DATASETS_DRAFT_COLLECTION_CODE = 'datasets/draft'

export const ARTICLES_COLLECTION_CODE = 'articles'
export const ARTICLES_DRAFT_COLLECTION_CODE = 'articles/draft'

export const STATE_EDITING = 'editing'
export const STATE_APPROVED = 'approved'
export const STATE_PUBLISHED = 'published'
export const STATE_PENDING_APPROVAL = 'pending-approval'

export const AUTHOR_TYPES = Object.freeze({
  PERSON: 'personal',
  ORGANIZATION: 'organizational',
})

export const TAXONOMY_TERM_DATASET = {
  "COAR": {
    "type": {
      "1": "dataset"
    }
  },
  "alias": {
    "cs": "Data"
  },
  "busy_count": 0,
  "descendants_busy_count": 0,
  "descendants_count": 0,
  "level": 1,
  "links": {
    "self": "https://127.0.0.1:5000/2.0/taxonomies/resourceType/datasets",
    "tree": "https://127.0.0.1:5000/2.0/taxonomies/resourceType/datasets?representation:include=dsc"
  },
  "relatedURI": {
    "1": "http://purl.org/coar/resource_type/c_ddb1"
  },
  "slug": "datasets",
  "status": "alive",
  "title": {
    "cs": "Datov\u00e1 sada",
    "en": "Dataset"
  }
}

export const TAXONOMY_TERM_RESTRICTED = {
    "busy_count": 0,
    "descendants_busy_count": 0,
    "descendants_count": 0,
    "level": 1,
    "links": {
      "self": "https://127.0.0.1:5000/2.0/taxonomies/accessRights/c-16ec",
      "tree": "https://127.0.0.1:5000/2.0/taxonomies/accessRights/c-16ec?representation:include=dsc"
    },
    "relatedURI": {
      "coar": "http://purl.org/coar/access_right/c_16ec"
    },
    "slug": "c-16ec",
    "status": "alive",
    "title": {
      "cs": "omezen\u00fd p\u0159\u00edstup",
      "en": "restricted access"
    }
  }

  export const TAXONOMY_TERM_OPENACCESS = {
  "busy_count": 0,
  "descendants_busy_count": 0,
  "descendants_count": 0,
  "level": 1,
  "links": {
    "self": "https://127.0.0.1:5000/2.0/taxonomies/accessRights/c-abf2",
    "tree": "https://127.0.0.1:5000/2.0/taxonomies/accessRights/c-abf2?representation:include=dsc"
  },
  "relatedURI": {
    "coar": "http://purl.org/coar/access_right/c_abf2"
  },
  "slug": "c-abf2",
  "status": "alive",
  "title": {
    "cs": "otev\u0159en\u00fd p\u0159\u00edstup",
    "en": "open access"
  }
}

export const DEFAULT_AUTHOR_ITEM = {
  fullName: '',
  nameType: AUTHOR_TYPES.PERSON,
  authorityIdentifiers: [],
  affiliation: []
}

export const DEFAULT_ORGANIZATION_ITEM = {
  fullName: '',
  nameType: AUTHOR_TYPES.ORGANIZATION
}

export const DEFAULT_FUNDING_ITEM = {
  projectID: '',
  projectName: '',
  fundingProgram: '',
  funder: {}
}

export const DEFAULT_MAIN_TITLE = {'title': {}, 'titleType': 'mainTitle'}

export const RESOURCE_IDENTIFIER_SCHEMES = [
  "ark",
  "arxiv",
  "bibcode",
  "doi",
  "ean13",
  "eissn",
  "handle",
  "igsn",
  "isbn",
  "issn",
  "istc",
  "lissn",
  "lsid",
  "pmid",
  "purl",
  "upc",
  "url",
  "urn",
  "w3id"
]

// Refers to MULTILINGUAL_SUPPORTED_LANGUAGES config.py API option
export const API_MULTILINGUAL_SUPPORTED_LANGUAGES = [
  'cs', 'en', 'sk', 'de', 'fr', 'ru',
  'es', 'nl', 'it', 'no', 'pl', 'da', 'el',
  'hu', 'lt', 'pt', 'bg', 'ro', 'sv'
]

export const PERSON_IDENTIFIER_SCHEMES = [
  "orcid",
  "scopusID",
  "researcherID",
  "czenasAutID",
  "vedidk",
  "ISNI",
]

// TODO: migrate to taxonomy terms
export const CONTRIBUTOR_ROLES = [
  'advisor',
  'artist',
  'collaborator',
  'contact-person',
  'data-curator',
  'data-manager',
  'distributor',
  'editor',
  'organizer',
  'panelist',
  'photographer',
  'producer',
  'project-leader',
  'project-manager',
  'project-member',
  'research-group',
  'referee',
  'researcher',
  'reviewer',
  'licenses-holder',
  'supervisor',
  'translator'
]

// TODO: migrate to taxonomy terms
export const AFFILIATIONS = ['CESNET', 'VŠCHT', 'NTK', 'AVČR']

export default {
  TAXONOMY_TERM_RESTRICTED,
  TAXONOMY_TERM_OPENACCESS,
  TAXONOMY_TERM_DATASET,
  PRIMARY_COMMUNITY_FIELD,
  DEFAULT_AUTHOR_ITEM,
  DEFAULT_MAIN_TITLE,
  DATASETS_COLLECTION_CODE,
  DATASETS_DRAFT_COLLECTION_CODE,
  ARTICLES_COLLECTION_CODE,
  ARTICLES_DRAFT_COLLECTION_CODE,
  STATE_EDITING,
  STATE_PENDING_APPROVAL,
  RESOURCE_IDENTIFIER_SCHEMES,
  PERSON_IDENTIFIER_SCHEMES,
  AUTHOR_TYPES,
  AFFILIATIONS,
  CONTRIBUTOR_ROLES,
}
