import { reactive } from "vue"
import { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export const state = reactive({
  user: null as User | null,
  setUser: () => {
    state.user = supabase.auth.user()
  },
  profile: {
    username: "",
  },
  date: [] as any[],
})
