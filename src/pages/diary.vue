<template>
  <div>
    <div class="flex justify-between items-center mb-2 mx-8">
      <h2>
        Hi, <span class="text-cyan-400"> {{ state.profile.username }}</span>
      </h2>
      <h2 class="flex items-center">Secret Diary <i-ic:twotone-book></i-ic:twotone-book></h2>
    </div>
    <div id="diary" class="diary p-8 relative flex flex-col w-auto lg:w-screen-md lg:h-screen-md border-3 border-dark-900 rounded-xl">
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
      <div class="absolute z-0 right-full w-auto top-10 flex flex-col space-y-2">
        <button class="bookmark" @click="$router.push('/diary/editor')"><i-ic:twotone-add-circle></i-ic:twotone-add-circle></button>
        <button class="bookmark" @click="$router.push('/diary')"><i-ic:twotone-list-alt></i-ic:twotone-list-alt></button>
        <button class="bookmark" @click="$router.push('/diary')"><i-ic:twotone-filter></i-ic:twotone-filter></button>
      </div>
      <div class="absolute z-0 right-full w-auto bottom-10 flex flex-col space-y-2">
        <button class="bookmark" @click="$router.push('/diary/config')"><i-ic:twotone-settings></i-ic:twotone-settings></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { state } from "@/store"
import { supabase } from "@/supabase"
import { onMounted } from "vue"

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
    state.date = data
  }
  const profile = await supabase.from("profiles").select("*")

  profile.data ? (state.profile.username = profile.data[0].username) : ""
})
</script>

<style lang="postcss">
@media only screen and (min-height: 600px) {
  #diary {
    @apply h-screen-sm;
  }
}
@media only screen and (min-height: 900px) {
  #diary {
    @apply h-screen-md;
  }
}
</style>
