<template lang="pug">
  q-card(flat clickable)
    q-card-section(horizontal)
      q-card-section(v-if="loading")
        q-skeleton(type="rect" width="400px" height="40px")
        q-skeleton.q-mt-sm(type="text" width="300px")
        //q-skeleton.q-mx-md.q-mb-sm.absolute-bottom.q-card__section--vert(type="text" :width="`${imageSize}px`")
      q-card-section.full-width(v-else)
        .row
          .col.text-h5.q-mt-sm.q-mb-xs.gt-xs {{ d.title.cs }}
        .text-bold.q-mt-sm.q-mb-xs.lt-sm {{ d.title.cs }}
        .text-subtitle1.q-mt-sm.text-grey-8.normal-line-height(v-for="(r, idx) in d.works" :key="idx") {{ $t('label.restoredBy', { restorer: r.creator}) }}
        .q-mt-lg.text-grey-7.highlight(v-html="highlight" v-if="hasHighlight")
        .q-mt-lg.text-grey-7.highlight(v-else-if="shortDescription" v-html="shortDescription")
        //.text-subtitle2.text-grey-8.absolute-bottom.q-card__section--vert {{ $t('label.createdAt') }} {{ $d(new Date(d.created)) }}
      q-skeleton.absolute-bottom-right.q-px-sm.q-ma-md(
        v-if="loading"
        animation="pulse"
        type="QBtn")
      q-btn.absolute-bottom-right.q-px-sm.q-ma-md(
        v-else
        color="primary"
        rounded
        :label="$t('nav.detail')"
        @click.stop="detail")
</template>

<script>
import { Component, Emit, Vue } from 'vue-property-decorator'
import { sanitize } from 'src/utils/bleach'

const options = {
  mode: 'white',
  list: [
    'em'
  ]
}

export default @Component({
  name: 'ItemListEntry',
  props: {
    loading: Boolean,
    item: Object,
    showState: Boolean
  },
  components: {
  }
})
class ItemListEntry extends Vue {
  @Emit('detail')
  detail () {
    return this.item
  }

  get d () {
    return this.item.metadata || {}
  }

  get highlight () {
    return sanitize(Object.values(this.item.highlight || {}).flat().join(' ... '), options)
  }

  get hasHighlight () {
    return this.item.highlight && Object.keys(this.item.highlight).length
  }

  get shortDescription () {
    let maxLen = {
      xs: 0,
      sm: 0,
      md: 100,
      lg: 200,
      xl: 700
    }[this.$q.screen.name]
    if (this.$q.screen.md && this.$q.screen.width < 1200) {
      maxLen = 0
    }
    if (maxLen) {
      const ret = ((this.d.description && this.d.description.cs) || '')
      if (ret.length >= maxLen) {
        return sanitize(ret.substr(0, maxLen) + ' ...')
      } else {
        return sanitize(ret)
      }
    } else {
      return ''
    }
  }
}
</script>

<style lang="sass">
.highlight em
  font-weight: bolder
  color: #616161 !important
</style>
