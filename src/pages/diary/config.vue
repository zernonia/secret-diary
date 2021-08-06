<template>
  <div class="p-8 w-full h-full flex flex-col justify-between">
    <div class="flex flex-col space-y-4">
      <h1>Profile</h1>
      <div class="flex justify-between items-end">
        <div @click="uploadPhoto" class="w-48 h-48 flex items-center justify-center rounded-xl cursor-pointer border-3 border-dark-900 overflow-hidden">
          <img :src="imageSrc" alt="" />
        </div>
        <div class="flex-1 ml-8 flex flex-col space-y-4">
          <div class="flex flex-col space-y-1">
            <label for="special_name">Username</label>
            <input type="text" name="special_name" v-model="profiles.username" />
          </div>
          <div class="flex flex-col space-y-1">
            <label for="number">Registered Number</label>
            <input type="text" name="number" disabled v-model="profiles.phone_number" />
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="flex items-center space-x-4">
      <button class="btn-solid flex items-center" @click="save">Save ! <i-ic:twotone-save class="ml-2"></i-ic:twotone-save></button>
      <button class="btn flex items-center" @click="cancel">
        Nevermind... <i-ic:twotone-developer-board-off class="ml-2"></i-ic:twotone-developer-board-off>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { state } from "@/store"
import { supabase } from "@/supabase"
import { onMounted, ref, readonly } from "vue"

const profiles = ref({
  id: "",
  username: "",
  avatar_url: "",
  phone_number: "",
})
const imageSrc = ref("../src/assets/user-none.jpg")
const initialState = {
  id: "",
  username: "",
  avatar_url: "",
  phone_number: "",
}

const uploadPhoto = async () => {
  let fakeInput = document.createElement("input")
  fakeInput.type = "file"
  fakeInput.accept = "image/*"
  fakeInput.multiple = false
  fakeInput.click()

  fakeInput.addEventListener("change", function () {
    let files = fakeInput.files
    if (files && files[0]) {
      handleUpload(files[0])
    }
  })

  const handleUpload = async (file: File) => {
    let formData = new FormData()
    formData.append("file", file)
    const { data, error } = await supabase.storage.from("avatars").upload(file.name, formData, {
      upsert: true,
    })
    if (data) {
      profiles.value.avatar_url = data.Key.split("/")[1]
      downloadImage(data.Key.split("/")[1])
    }
  }
}
const downloadImage = async (key: string) => {
  const { data, error } = await supabase.storage.from("avatars").download(key)
  imageSrc.value = URL.createObjectURL(data)
}

const save = async () => {
  const { data, error } = await supabase.from("profiles").update(profiles.value).match({ id: state.user?.id })
  if (data) {
    Object.assign(initialState, data[0])
  }
}

const cancel = () => {
  Object.assign(profiles.value, initialState)
}

onMounted(async () => {
  const { data, error } = await supabase.from("profiles").select("*")
  if (data) {
    profiles.value = data[0]
    Object.assign(initialState, data[0])
  }
  downloadImage(profiles.value.avatar_url)
})
</script>
