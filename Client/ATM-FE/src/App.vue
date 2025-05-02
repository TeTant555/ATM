<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner'

</script>
<template>
  <Toaster />
  <ClientOnly>
    <Toaster />
  </ClientOnly>
  <RouterView />
</template>
