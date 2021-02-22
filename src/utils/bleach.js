import bleach from 'bleach'

const descriptionOptions = {
  mode: 'white',
  list: [
    'em',
    'div',
    'p',
    'b',
    'i'
  ]
}

function sanitize (text, options = null) {
  if (!options) {
    options = descriptionOptions
  }
  return bleach.sanitize(text, options)
}

export { sanitize }
