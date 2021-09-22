<template lang="pug">
dataset-form(v-model="formData" mode="create")
</template>

<script>
import {defineComponent, ref} from 'vue'
import DatasetForm from "components/forms/DatasetForm";

export default defineComponent({
  name: 'CreateDatasetForm',
  components: {
    DatasetForm
  },
  setup() {
    const formData = ref({})

    return {
      formData,
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
