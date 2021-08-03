<template>
  <div class="diary p-8 flex flex-col w-screen-md h-screen-md border-3 border-dark-900 rounded-xl">
    <h1>Secret Diary</h1>
    <div class="w-full h-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
.diary-page {
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23beaed9' fill-opacity='0.11' fill-rule='evenodd'%3E%3Ccircle cx='0' cy='0' r='0'/%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
