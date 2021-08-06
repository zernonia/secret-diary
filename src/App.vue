<template>
  <div>
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
