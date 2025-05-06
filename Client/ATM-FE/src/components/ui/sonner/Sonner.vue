<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': '#F8FAFC',           // Tailwind slate-50
      '--normal-text': '#0F172A',         // Tailwind slate-900
      '--normal-border': '#E2E8F0',       // Tailwind slate-200
      '--toast-shadow': '0 4px 12px #CBD5E1', // Tailwind slate-300
    }"
  />
</template>
