<template>
  <div>
    <h1>Secret Diary</h1>
    <div class="diary p-8 relative flex flex-col w-screen-md h-screen-md border-3 border-dark-900 rounded-xl">
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
      <button class="">Write diary</button>
    </div>
  </div>
</template>
