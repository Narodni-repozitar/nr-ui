import deepcopy from 'deepcopy'

export default {
  watch(modelValue) {
    model.value = deepcopy(modelValue)
  }
}
