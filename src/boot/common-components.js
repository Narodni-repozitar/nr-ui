import {boot} from 'quasar/wrappers'
import MultilingualText from 'src/components/i18n/MultilingualText'
import MultilingualTextTabs from 'src/components/i18n/MultilingualTextTabs'
import MultilingualTextLanguages from 'src/components/i18n/MultilingualTextLanguages'
import SimpleTerm from 'src/components/taxonomy/SimpleTerm'
import CancelButton from 'src/components/controls/CancelButton'
import DoubleSeparator from 'src/components/ui/DoubleSeparator'
import VerticalSeparator from 'src/components/ui/VerticalSeparator'
import SeparatedList from 'src/components/ui/SeparatedList'
import NestedFacet from 'components/facets/NestedFacet'
import FacetContainer from 'src/components/facets/FacetContainer'

export default boot(({app}) => {
  app.component('mt', MultilingualText)
  app.component('mt-languages', MultilingualTextLanguages)
  app.component('mt-tabs', MultilingualTextTabs)
  app.component('simple-term', SimpleTerm)
  app.component('cancel-button', CancelButton)
  app.component('double-separator', DoubleSeparator)
  app.component('vertical-separator', VerticalSeparator)
  app.component('separated-list', SeparatedList)
  app.component('nested-facet', NestedFacet)
  app.component('facet-container', FacetContainer)
})
