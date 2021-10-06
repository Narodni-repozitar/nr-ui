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
        @click="currentCommunity?.id !== c.id? setCommunity(c.id) : setCommunity()"
        :active="c.id === currentCommunity?.id"
        active-class="bg-accent text-white")
        q-item-section.text-subtitle2 {{ c.title }}
        q-item-section.text-caption {{ c.metadata.description }}
</template>

<script>
import useAuth from 'src/composables/useAuth'
import {computed, ref} from 'vue'
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
    const {setCommunity, currentCommunity} = useContext(community)
    const {currentUserCommunities} = useAuth()

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

    return {currentCommunity, slides, model, setCommunity}
  }
  }
</script>

<style scoped>

</style>
