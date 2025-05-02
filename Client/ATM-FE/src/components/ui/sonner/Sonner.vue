<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': '#F8F9FA',          // --color-sw
      '--normal-text': '#00246B',        // --color-pri
      '--normal-border': '#CADCFC',      // --color-sec
      '--toast-shadow': '0 4px 12px #CADCFC', // optional: light box-shadow
    }"
  />
</template>
