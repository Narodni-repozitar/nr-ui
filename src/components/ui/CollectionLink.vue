<template lang="pug">
q-card.q-px-md.full-height.collection-card.transparent-grey.no-box-shadow(rounded)
  q-badge.text-weight-bold.text-subtitle2(color="accent" floating v-if="badge" style="right: -1px; top: -10px;") {{ badge }}
  .row.justify-center
    q-img(
      fit="cover"
      ratio="1"
      width="200px"
      :src="headerImage"
      alt="collection icon")
  q-card-section.q-mb-lg.q-pt-none
    .row.no-wrap.items-center.justify-center.text-center
      .col-auto.text-h6.q-pt-none {{ title }}
    q-separator.text-secondary.bg-secondary(spaced v-if="description")
    .row.items-center.justify-center(v-if="description")
      p.text-subtitle2.text-center.text-weight-light.col-auto {{ description }}
  q-card-actions.absolute-bottom.no-padding
    q-btn.full-width.full-height.bg-secondary-light(flat size="md" color="secondary" :to="to") {{ $t('action.browse') }}
</template>

<script>
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: 'CollectionLink',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    to: {
      type: Object,
      required: true
    },
    badge: String
  },
  setup (props) {
    const headerImage = computed(() => {
      return require(`src/assets/${props.icon}`)
    })

    return {headerImage}
  }
})
</script>

<style lang="sass" scoped>
.collection-card
  border: 1px dashed $secondary
  width: 300px
</style>
