<template lang="pug">
pagination(:pages="pages" :shownPages="shownPages" v-model="$query.page")
</template>

<script>
import {defineComponent} from "vue";
import Pagination from './Pagination'

export default defineComponent({
  name: 'URLPagination',
  props: {
    pages: Number,
    shownPages: {
      type: Number,
      default: 10
    }
  },
  components: {
    Pagination
  }
})
</script>
