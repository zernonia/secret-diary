<template>
  <div>
    <h1 class="mb-2 ml-8">Secret Diary</h1>
    <div id="diary" class="diary p-8 relative flex flex-col w-screen-md h-screen-md border-3 border-dark-900 rounded-xl">
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
      <div class="absolute z-0 right-full w-auto top-10 flex flex-col space-y-2">
        <button class="bookmark" @click="$router.push('/diary/editor')"><i-ic:twotone-add-circle></i-ic:twotone-add-circle></button>
        <button class="bookmark" @click="$router.push('/diary')"><i-ic:twotone-list-alt></i-ic:twotone-list-alt></button>
      </div>
      <div class="absolute z-0 right-full w-auto bottom-10 flex flex-col space-y-2">
        <button class="bookmark"><i-ic:twotone-settings></i-ic:twotone-settings></button>
      </div>
    </div>
  </div>
</template>

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
