export function useTranslated(locale) {
  const mt = (multilang) => {
    if (!multilang) {
      return undefined
    }
    if (multilang[locale.value]) {
      return multilang[locale.value]
    }
    if (multilang['cs']) {
      return multilang['cs']
    }
    for (const k of Object.keys(multilang)) {
      if (typeof multilang[k] === 'string') {
        return multilang[k]
      }
    }
  }

  const mtr = (multilang, translation) => {
    if (!multilang) {
      return undefined
    }

    return Object.keys(multilang).find(key => multilang[key] === translation);
  }

  return {mt, mtr}
}
