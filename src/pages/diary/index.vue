<template>
  <div class="flex flex-col items-center justify-center h-full pb-8">
    <h2 class="mb-8">Diary sub</h2>
    <Calendar :rows="row" :columns="2" :max-date="new Date()" :attributes="attrs" @dayclick="onDayClick" />
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/supabase"
import { computed, onMounted, ref } from "vue"
import { Calendar, DatePicker } from "v-calendar"
import { useRouter } from "vue-router"
import { useWindowSize } from "@vueuse/core"

const router = useRouter()
const { width, height } = useWindowSize()

const list = ref<any[]>([])
const attrs = computed(() => {
  return list.value.map((i) => {
    return {
      highlight: true,
      dates: i.date,
    }
  })
})
const row = computed(() => {
  if (height.value >= 900) {
    return 2
  } else {
    return 1
  }
})

const onDayClick = (e: any) => {
  console.log(e.attributes[0])
  if (e.attributes[0]) {
    router.push("/diary/" + e.id)
  }
}

onMounted(async () => {
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .match({
      is_editing: false,
    })
    .order("date", {
      ascending: false,
    })
  if (data?.length) {
    list.value = data
  }
})
</script>

<style lang="postcss">
.vc-pane-layout {
  @apply gap-30px;
}
.vc-container {
  @apply !border-0 shadow-none rounded-xl;
}
.vc-highlight {
  @apply !bg-dark-900;
}
.vc-popover-caret.align-left {
  right: 20%;
}
.vc-nav-popover-container {
  @apply bg-white border-3 border-dark-900 text-dark-900 p-10px;
}
.vc-popover-caret.direction-bottom {
  @apply -top-2px;
}
.vc-nav-title {
  @apply text-dark-900 font-semibold;
}
.vc-nav-arrow:hover,
.vc-nav-title:hover,
.vc-nav-item:hover {
  @apply bg-cyan-300 text-dark-900 shadow-none;
}
.vc-nav-arrow:focus,
.vc-nav-title:focus,
.vc-nav-item:focus {
  @apply border-cyan-300;
}

.vc-nav-item.is-active {
  @apply shadow-none bg-dark-900 text-white;
}
.vc-nav-item.is-current {
  @apply border-dark-900 text-dark-900;
}
</style>
