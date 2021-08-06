<template>
  <div class="fullpage">
    <h1 class="flex items-center">Secret Diary <i-ic:twotone-book class="ml-2"></i-ic:twotone-book></h1>
    <button class="btn my-4" @click="$router.push('/login')">Open</button>
  </div>
  <div class="fullpage">
    <div class="grid grid-cols-3 gap-8">
      <div class="border-3 border-dark-900 rounded-xl p-6">
        <h2>Simple</h2>
        <p>Just a simple diary, that makes</p>
      </div>
      <div class="border-3 border-dark-900 rounded-xl p-6">
        <h2>Secret</h2>
        <p>Just a simple diary, that makes</p>
      </div>
      <div class="border-3 border-dark-900 rounded-xl p-6">
        <h2>Secret</h2>
        <p>Just a simple diary, that makes</p>
      </div>
    </div>
  </div>
</template>
