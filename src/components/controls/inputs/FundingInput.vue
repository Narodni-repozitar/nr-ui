<template lang="pug">
q-field.no-margin.no-label-float.row(
  ref="input"
  :error="error"
  :error-message="errorMessage"
  stack-label
  square
  borderless
  :label="label")
  template(v-slot:control)
    .q-pl-md.full-width
      .row.full-width.q-py-none.q-my-none
        q-input.full-width(
          ref="projectID"
          autofocus
          :label="`${$t('label.fundingProjectID')} *`"
          v-model="model.projectID"
          :rules="[required($t('error.validation.required'))]"
          @update:model-value="onChange")
      .row.full-width.q-py-none.q-my-none
        q-input.full-width(
          ref="projectName"
          :label="$t('label.fundingProjectName')"
          v-model="model.projectName"
          @update:model-value="onChange")
      .row.full-width.q-py-none.q-my-none
        q-input.full-width(
          ref="fundingProgram"
          :label="$t('label.fundingProgram')"
          v-model="model.fundingProgram"
          @update:model-value="onChange")
      .row.full-width.q-py-none.q-my-none
        funder-select(
          ref="funder"
          :label="`${$t('label.funder')} *`"
          v-model="model.funder"
          :rules="[required($t('error.validation.required'))]")
</template>

<script>
import {defineComponent, ref} from 'vue'
import useValidation from 'src/composables/useValidation'
import ValidateMixin from '/src/mixins/ValidateMixin'
import {DEFAULT_FUNDING_ITEM} from 'src/constants'
import deepcopy from "deepcopy";
import useModel from 'src/composables/useModel'
import FunderSelect from 'components/controls/selects/FunderSelect'


export default defineComponent({
  name: "FundingInput",
  components: {FunderSelect},
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    noRoles: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => {
        return DEFAULT_FUNDING_ITEM
      }
    }
  },
  setup(props, ctx) {
    const model = ref(deepcopy(props.modelValue))

    const {onChange} = useModel(ctx, model)
    const {error, errorMessage, resetValidation, required} = useValidation()
    const projectID = ref(null)
    const projectName = ref(null)
    const fundingProgram = ref(null)
    const funder = ref(null)

    function validate() {
      resetValidation()

      const pidr = projectID.value.validate()
      const funr = funder.value.validate()

      if (pidr !== true ||
          funr !== true) {
        error.value = true
      }
      return error.value ? 'error.validationFail' : true
    }

    return {
      error, errorMessage, model, projectID, projectName,
      fundingProgram, funder, onChange, required, validate
    }
  }
})
</script>

<style scoped>

</style>
