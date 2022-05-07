<script setup lang="ts">
import { computed } from 'vue'
import VPExample from './VPExample.vue'
import VPSourceCode from './VPSourceCode.vue'

const props = defineProps<{
  demos: object
  source: string
  path: string
  description?: string
}>()

const code = computed(() => {
  return decodeURIComponent(props.source)
})

const formatPathDemos = computed(() => {
  const demos = {}
  Object.keys(props.demos).forEach((key) => {
    demos[key.replace('../examples/', '').replace('.vue', '')] =
      props.demos[key].default
  })
  return demos
})
</script>

<template>
  <ClientOnly>
    <div class="vt-demo">
      <VPExample :demo="formatPathDemos[path]" />
      <VPSourceCode :source="code" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.vt-demo {
  margin-bottom: 60px;
}
</style>
