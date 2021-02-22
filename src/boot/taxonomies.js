import { TaxonomyComponentFactory, VueTaxonomy } from '@oarepo/quasar-taxonomy-editor'
import TaxonomyTerm from 'components/common/TaxonomyTerm'

class TermViewFactory extends TaxonomyComponentFactory {
  getComponent ({ term, parent, usage }) {
    return TaxonomyTerm
  }
}

export default ({ Vue, store }) => {
  Vue.use(VueTaxonomy, {
    defaultTermViewer: new TermViewFactory()
  })
}
