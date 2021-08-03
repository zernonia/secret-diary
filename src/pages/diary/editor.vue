<template>
  <section class="flex flex-col justify-between h-full">
    <div>
      <p>{{ date }}</p>
      <div class="flex space-x-4" v-if="editor">
        <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </button>
        <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </button>
        <button @click="editor?.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">paragraph</button>
      </div>
      <div class="mt-4 diary-page">
        <BubbleMenu class="bubble bg-white p-2 rounded-lg border-3 border-cyan-300 flex items-center space-x-1" :editor="editor" v-if="editor">
          <button @click="editor?.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            <i-ic:round-format-bold></i-ic:round-format-bold>
          </button>
          <button @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <i-ic:round-format-italic></i-ic:round-format-italic>
          </button>
          <button @click="editor?.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <i-ic:round-strikethrough-s></i-ic:round-strikethrough-s>
          </button>
          <button @click="editor?.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            <i-ic:round-align-horizontal-left></i-ic:round-align-horizontal-left>
          </button>
          <button @click="editor?.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
            <i-ic:round-align-horizontal-center></i-ic:round-align-horizontal-center>
          </button>
          <button @click="editor?.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
            <i-ic:round-align-horizontal-right></i-ic:round-align-horizontal-right>
          </button>
          <!-- <div class="!mx-4 w-5 h-5">
        <input class="p-1px rounded-md" type="color" name="highlight" @change="highlightColor" />
      </div> -->
        </BubbleMenu>
        <h3 class="dear-diary">Dear diary,</h3>
        <editor-content :editor="editor" />
      </div>
    </div>
    <button class="btn mt-4 flex items-center" @click="publishContent">Goodnight.. <i-ic:twotone-save class="ml-2"></i-ic:twotone-save></button>
  </section>
</template>

<script setup lang="ts">
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"

import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { supabase } from "@/supabase"
import { useIdle } from "@vueuse/core"
import { state } from "@/store"
import { useRouter } from "vue-router"

const router = useRouter()
const content = ref<any>({})
// (new Date()).toISOString().split('T')[0];
const date = ref("2021-08-03")
const editor = ref<Editor>()
const isPublishing = ref(false)

// highlight text function
const highlightColor = (e: InputEvent) => {
  console.log(e)
}

onMounted(async () => {
  fetchContent()
  editor.value = new Editor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    autofocus: true,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none",
      },
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const { idle, lastActive } = useIdle(3 * 1000, {
  events: ["keydown"],
})

watch(idle, (n) => {
  if (n && !isPublishing.value) {
    saveContent()
  }
})

// Supabase Action
const fetchContent = async () => {
  const { data, error } = await supabase.from("diaries").select("*").eq("date", date.value)
  if (data?.length) {
    content.value = data[0]
    editor.value?.commands.setContent(content.value.content)
  }
}

const saveContent = async () => {
  const { data, error } = await supabase.from("diaries").upsert({
    id: content.value.id,
    date: date.value,
    content: editor.value?.getJSON(),
    user_id: state.user?.id,
  })
}

const publishContent = async () => {
  isPublishing.value = true
  const { data, error } = await supabase.from("diaries").upsert({
    id: content.value.id,
    is_editing: false,
    content: editor.value?.getJSON(),
    user_id: state.user?.id,
  })

  if (error) {
    console.log("Saving problem")
  } else {
    router.push(`/diary/${date.value}`)
  }
  isPublishing.value = false
}
</script>

<style lang="postcss">
.bubble > button {
  @apply flex items-center p-2 rounded-md hover:bg-cyan-300 transition-all ease-in-out focus:outline-none outline-none;
}
.is-active {
  @apply bg-cyan-300;
}
</style>
