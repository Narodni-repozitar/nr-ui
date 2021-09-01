<template lang="pug">
.column
  q-input(v-model="model.bla")
  title-input(v-model="model.mainTitle")
  q-list(dense separator).full-width.no-padding.no-margin
    q-item.full-width.no-margin.no-padding(v-for="(val,idx) in model.alternativeTitles" :key="idx")
      q-item-section.no-padding.no-margin
        title-input(v-model="model.alternativeTitles[idx]")
      q-item-section
        q-btn(round dense flat color="negative" icon="backspace" @click="rmItem(idx)")
          q-tooltip {{ $t('action.rmItem') }}
  q-btn(round dense flat color="positive" icon="post_add" @click="addItem")
    q-tooltip {{ $t('action.addItem') }}
</template>

<script>
import {computed, defineComponent, reactive, ref} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import useValidation from 'src/composables/useValidation'
import TitleInput from 'components/controls/inputs/TitleInput'
import {useQuasar} from 'quasar'


const DEFAULT_MAIN_TITLE = {'title': {}, 'titleType': 'mainTitle'}

export default defineComponent({
  name: 'TitleInputList',
  emits: ['update:modelValue'],
  components: {
    TitleInput
  },
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Array,
      default: () => [DEFAULT_MAIN_TITLE]
    }
  },
  setup(props, ctx) {
    const input = ref(null)
    const {required, resetValidation} = useValidation()
    const $q = useQuasar()

    const mainTitle = computed(() => {
      return props.modelValue.filter(t => t.titleType === 'mainTitle')[0] || DEFAULT_MAIN_TITLE
    })

    const alternativeTitles = computed(() => {
      return props.modelValue.filter(t => t.titleType !== 'mainTitle')
    })

    const model = reactive({mainTitle: mainTitle.value, alternativeTitles: [...alternativeTitles.value]})

    const modelExternal = computed(() => {
      return [{...props.modelValue[0], ...{titleType: props.titleType}}]
    })

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    function rmItem(idx) {
      model.alternativeTitles.splice(idx, 1)
    }

    function addItem() {
      $q.dialog({
        title: 'Options',
        message: 'Choose an option:',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            {label: 'Alternative Title', value: 'alternativeTitle'},
            {label: 'Subtitle', value: 'subtitle'},
            {label: 'Other', value: 'other'}
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', data)
      })
    }

    return {input, model, required, onChange, addItem, rmItem, mainTitle, alternativeTitles}
  }
})
</script>

<style lang="sass" scoped>
</style>
