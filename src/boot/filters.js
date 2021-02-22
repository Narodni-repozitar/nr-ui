import { date } from 'quasar'

export default ({
  _,
  Vue
}) => {
  Vue.filter('formatDate', function (value) {
    return date.formatDate(value, 'YYYY/M/D')
  })
  Vue.prototype.formatName = function (name) {
    const fullName = []
    if (name.honorificBefore) {
      fullName.push(name.honorificBefore)
    }
    if (name.firstName) {
      if (fullName.length) {
        fullName.push(' ')
      }
      fullName.push(name.firstName)
    }
    if (name.lastName) {
      if (fullName.length) {
        fullName.push(' ')
      }
      fullName.push(name.lastName)
    }
    if (name.honorificAfter) {
      fullName.push(', ', name.honorificAfter)
    }
    return fullName.join('')
  }
  Vue.prototype.formatInstitution = function (institution) {
    if (institution && institution.name) {
      return institution.name
    }
    return ''
  }
}
