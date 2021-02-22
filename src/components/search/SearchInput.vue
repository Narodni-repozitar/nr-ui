<template lang="pug">
  q-input(
    rounded
    outlined
    type="search"
    @input="doSearch"
    :debounce="1000"
    v-model="query"
    input-class="search__input q-px-md"
    :placeholder="`${$t('input.searchItem')}…`"
    @keydown.enter.prevent="doSearch"
    ref='search')
    template(v-slot:append)
      q-icon(v-if="query === ''" name="search")
</template>

<script>
import { Component, Emit, Vue } from 'vue-property-decorator'

export default @Component({
  name: 'SearchInput'
})
class SearchInput extends Vue {
  query = ''

  @Emit('search')
  doSearch () {
    console.debug('search query', this.query)
    if (this.$route.name !== 'restorations/all-objects') {
      this.$router.push({ name: 'restorations/all-objects' })
    }
    this.$query.q = this.query
    this.$query.page = 1
    return this.query
  }

  mounted () {
    this.query = this.$query.q || ''
  }
}
</script>

<style lang="sass" scoped>
.search
  &__input
    padding-left: 1rem
</style>
