<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from './assets/theme';
const { open, theme, setTheme } = useTheme()

</script>
<template>
  <Toaster />
  <ClientOnly>
    <Toaster />
  </ClientOnly>
  <RouterView />
</template>
