<template>
  <div class="p-10 sm:p-16 lg:p-8 h-screen w-screen flex flex-col items-center justify-center">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { state } from "./store"

onMounted(() => {
  state.setUser()
})
</script>
