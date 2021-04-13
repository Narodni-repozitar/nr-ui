<template lang="pug">
.paginator
  a.paginator-link(href="" v-if="firstPage" @click.prevent="model=firstPage") {{ firstPage }}
  span.paginator-nonlink(v-if="firstPage") ...
  a.paginator-link(href="" v-for="page in pagesList"  @click.prevent="model=page")
    span(:class="{'active': page === modelValue}") {{ page }}
  span.paginator-nonlink(v-if="lastPage") ...
  span.paginator-nonlink(v-if="lastPage") {{ lastPage }}
</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {computed} from "@vue/reactivity";

export default defineComponent({
  name: 'Pagination',
  props: {
    modelValue: Number,
    pages: Number,
    shownPages: {
      type: Number,
      default: 10
    }
  },
  components: {},
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const model = ref(props.modelValue || 1)

    watch(() => props.modelValue, () => {
      if (props.modelValue !== model.value) {
        model.value = props.modelValue
      }
    })

    watch(model, () => {
      ctx.emit('update:modelValue', model.value)
    })

    const currentShownPages = computed(() => {
      return model.value < 96 ? props.shownPages : props.shownPages - 2
    })

    const startPage = computed(() => {
      const sp = Math.floor(currentShownPages.value / 2)
      return Math.max(1, model.value - sp)
    })

    const firstPage = computed(() => {
      return startPage.value > 1 ? 1 : undefined
    })

    const endPage = computed(() => {
      return Math.min(
          props.pages,
          startPage.value + currentShownPages.value - (startPage.value > 1 ? 0 : 1)
      )
    })

    const pagesList = computed(() => {
      return [...Array(endPage.value - startPage.value + 1).keys()].map(x => x + startPage.value)
    })

    const lastPage = computed(() => {
      return endPage.value !== props.pages ? props.pages : undefined
    })

    return {
      model,
      firstPage,
      startPage,
      endPage,
      lastPage,
      pagesList
    }
  }
})
</script>
