<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-2">Open Diary (Demo)</h1>
    <div v-if="loginPhase" class="flex flex-col items-center">
      <label for="">Phone Number</label>
      <input placeholder="+10123456789" type="text" v-model="phone_number" />
      <label for="">Password</label>
      <div class="flex items-center justify-between space-x-2">
        <input
          style="-moz-appearance: textfield; -webkit-text-security: disc"
          type="tel"
          maxlength="1"
          v-for="(t, index) in pin"
          :key="index"
          v-model="pin[index]"
          @input="handleInput"
          @keydown.backspace="handleBackspace"
        />
      </div>
      <div class="my-4 flex items-center space-x-2">
        <button class="btn-solid" @click="login">Login</button>
        <button class="btn" @click="register">Register</button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center">
      <label for="">Verify OTP</label>
      <div class="flex items-center justify-between space-x-2">
        <input
          type="tel"
          maxlength="1"
          v-for="(t, index) in token"
          :key="index"
          v-model="token[index]"
          @input="handleInput"
          @keydown.backspace="handleBackspace"
        />
      </div>
      <button class="btn mt-4" @click="verify">Verify</button>
    </div>

    <span class="text-sm py-1 px-4 bg-gray-100 text-center"
      >(Login: +60172542822 , Password: 123456) <br />
      Please be polite!
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "@/supabase"
import { useToast } from "vue-toastification"

const toast = useToast()
const phone_number = ref("")
const pin = ref(["", "", "", "", "", ""])
const token = ref(["", "", "", "", "", ""])
const loginPhase = ref(true)

const login = async () => {
  const regex = /^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  const regexDigit = /^[0-9]{6}$/
  const pinString = pin.value.join("")
  if (pinString.match(regexDigit)) {
    let { session, error } = await supabase.auth.signIn({
      phone: phone_number.value,
      password: pinString,
    })
    if (error) {
      toast.error(error.message)
    } else {
      router.push("/diary")
    }
  } else {
    toast.error("Invalid phone number")
  }
}
const register = async () => {
  const regex = /^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  const regexDigit = /^[0-9]{6}$/
  const pinString = pin.value.join("")
  if (pinString.match(regexDigit)) {
    let { user, error } = await supabase.auth.signUp({
      phone: phone_number.value,
      password: pinString,
    })
    if (error) {
      toast.error(error.message)
    } else {
      loginPhase.value = false
    }
  } else {
    toast.error("Invalid phone number")
  }
}
const router = useRouter()
const verify = async () => {
  const regex = /^[0-9]{6}$/
  const tokenString = token.value.join("")
  if (tokenString.match(regex)) {
    let { session, error } = await supabase.auth.verifyOTP({
      phone: phone_number.value,
      token: tokenString,
    })
    if (error) {
      toast.error(error.message)
    } else {
      router.push("/diary")
    }
  } else {
    toast.error("Token invalid")
  }
}

const handleInput = (e: InputEvent) => {
  const input = e.target as HTMLInputElement
  if (input.nextElementSibling && e.data) {
    input.nextElementSibling.focus()
  }
}

const handleBackspace = (e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement
  if (input.previousElementSibling && !e.target.value) {
    input.previousElementSibling.focus()
  }
}
</script>
