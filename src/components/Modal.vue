<template>
  <OnClickOutside @trigger="close">
    <div>Click Outside of Me</div>
  </OnClickOutside>
</template>
<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components"

const close = () => {
  console.log("close")
}
</script>
