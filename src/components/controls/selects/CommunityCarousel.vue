<template lang="pug">
q-carousel.full-width.rounded-borders.bg-grey-3(
  v-model="model"
  transition-prev="scale"
  transition-next="scale"
  swipeable
  animated
  keep-alive
  infinite
  padding
  control-type="outline"
  control-color="accent"
  :arrows="slides.length > 1"
  height="auto")
  q-carousel-slide.column.no-wrap.flex-start(
    v-for="(slide, idx) in slides" :key="idx"
    :name="idx")
    .row.justify-start.q-gutter-md
      q-item.community-carousel-item.col-2(
        v-for="c in slide" :key="c.id"
        clickable
        @click="effectiveCommunity.id !== c.id? setCommunity(c.id) : setCommunity()"
        :active="c.id === effectiveCommunity.id"
        active-class="bg-accent text-white")
        q-item-section.text-subtitle2 {{ c.title }}
        q-item-section.text-caption {{ c.metadata.description }}
</template>

<script>
import useAuth from 'src/composables/useAuth'
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'

export default {
  name: 'CommunityCarousel',
  props: {
    itemsPerSlide: {
      type: Number,
      default: 10
    },
  },
  setup(props) {
    const {t} = useI18n()
    const {setCommunity} = useContext(community)
    const {effectiveCommunity, currentUserCommunities} = useAuth()

    const model = ref(0)

    const slides = computed(() => {
      return currentUserCommunities.value.reduce((res, c, index) => {
        const slideIdx = Math.floor(index/props.itemsPerSlide)

        if(!res[slideIdx]) {
          res[slideIdx] = []
        }

        res[slideIdx].push(c)

        return res
      }, [])
    })

    return {effectiveCommunity, slides, model, setCommunity, community}
  }
  }
</script>

<style scoped>

</style>
