<template lang="pug">
q-stepper-navigation
  .row.full-width.justify-start
    q-btn.q-mr-md.col-auto(padding="md" v-if="hasPrev" color="primary" :label="$t('label.back')" @click="$emit('prev')")
    q-btn.col-auto.q-px-lg(padding="md" v-if="hasNext" color="secondary" :label="$t('label.continue')" @click="$emit('next')")
    q-btn.col-auto.q-px-lg(
      padding="md"
      icon="rotate_right"
      v-if="hasRetry"
      color="info"
      :label="$t('label.retry')"
      @click="$emit('retry')")
    q-btn.col-auto.q-px-lg(
      padding="md"
      icon="send"
      v-if="hasCreate"
      color="positive"
      :label="$t('label.submit')"
      @click="$emit('create')")
    q-btn.col-auto.q-px-lg(
      padding="md"
      icon="save"
      v-if="hasSave"
      color="positive"
      :label="$t('label.forms.saveChanges')"
      @click="$emit('save')")
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'StepperNav',
  props: {
    hasNext: {
      type: Boolean,
      default: true
    },
    hasPrev: {
      type: Boolean,
      default: false
    },
    hasRetry: {
      type: Boolean,
      default: false
    },
    hasSave: {
      type: Boolean,
      default: false
    },
    hasCreate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['prev', 'next', 'create', 'save', 'retry']
})
</script>

<style lang="sass" scoped>
</style>
