<template lang="pug">
q-layout.bg-secondary(view="hHh lpR lfr")
  navbar(mode="list" @facets="facets = !facets")
  q-drawer.scrolling-drawer(
    content-class="bg-secondary"
    show-if-above
    v-model="facets"
    side="right"
    :width=400)
      portal-target(name="drawer")
  q-page-container
    router-view
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Navbar from 'src/components/navigation/Navbar'

export default @Component({
  name: 'ItemListLayout',
  components: {
    Navbar
  }
})
class MainLayout extends Vue {
  facets = true
}
</script>
<style lang="sass">
</style>
