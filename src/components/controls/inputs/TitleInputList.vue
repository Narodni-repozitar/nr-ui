<template lang="pug">
q-field(
  ref="input"
  readonly
  borderless
  v-bind="$attrs"
  :label="label")
  template(v-slot:control)
    multilingual-input.no-padding.no-margin(v-model="model.mainTitle.title")
    q-list.full-width.no-padding.no-margin(dense)
      q-item.q-pl-md.full-width.no-margin(v-for="(val,idx) in model.alternativeTitles" :key="idx")
        q-item-section.no-padding.no-margin
          q-item-label.q-pt-sm.q-pl-sm(caption) {{ $t(`value.titleType.${model.alternativeTitles[idx].titleType}`) }}
          multilingual-input.no-padding.no-margin(dense v-model="model.alternativeTitles[idx].title")
        q-item-section(side)
          q-btn.self-center.q-mt-sm(round dense flat color="negative" icon="backspace"
            v-if="model.alternativeTitles.length"
            @click="rmItem(idx)")
            q-tooltip {{ $t('action.rmItem') }}
    q-btn.q-pl-sm(dense flat color="positive" icon="post_add" @click="addItem")
      q-tooltip {{ $t('action.addTitle') }}

</template>

<script>
import {computed, defineComponent, reactive, ref, watch} from 'vue'
import ValidateMixin from 'src/mixins/ValidateMixin'
import useValidation from 'src/composables/useValidation'
import {useQuasar} from 'quasar'
import MultilingualInput from 'components/controls/inputs/MultilingualInput'
import {useI18n} from 'vue-i18n'


const DEFAULT_MAIN_TITLE = {'title': {}, 'titleType': 'mainTitle'}

export default defineComponent({
  name: 'TitleInputList',
  emits: ['update:modelValue'],
  components: {
    MultilingualInput,
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
    const {t} = useI18n()
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

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', [model.mainTitle, ...model.alternativeTitles])
    }

    function rmItem(idx) {
      model.alternativeTitles.splice(idx, 1)
    }

    watch(model, () => {
      onChange()
    })

    function addItem() {
      $q.dialog({
        title: t('label.nameType'),
        message: `${t('action.choose')} ${t('label.nameType').toLowerCase()}`,
        options: {
          type: 'radio',
          model: 'lang',
          // inline: true
          items: [
            {label: t('value.titleType.alternativeTitle'), value: 'alternativeTitle'},
            {label: t('value.titleType.subtitle'), value: 'subtitle'},
            {label: t('value.titleType.other'), value: 'other'}
          ]
        },
        cancel: true,
        persistent: false
      }).onOk(data => {
        model.alternativeTitles.push({title: {}, titleType: data})
      })
    }

    return {input, model, required, onChange, addItem, rmItem, mainTitle, alternativeTitles}
  }
})
</script>

<style lang="sass" scoped>
</style>
