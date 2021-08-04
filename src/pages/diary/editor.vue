<template>
  <section class="flex flex-col justify-between h-full">
    <div class="flex items-center justify-between">
      <div class="flex space-x-4" v-if="editor">
        <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </button>
        <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </button>
        <button @click="editor?.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">paragraph</button>
      </div>
      <DatePicker
        style="font-family: Inter, sans-serif"
        v-model="date"
        :max-date="new Date()"
        :masks="masks"
        :popover="{ placement: 'bottom-end' }"
        :is-required="true"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input class="border-b-3 border-dotted text-center w-110px" :value="inputValue" v-on="inputEvents" />
        </template>
      </DatePicker>
    </div>
    <div class="overflow-auto h-full">
      <div class="mt-4 diary-page h-auto overflow-hidden overflow-y-auto">
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
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { Calendar, DatePicker } from "v-calendar"
import { createImageExtension } from "@/plugin/image"

import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { supabase } from "@/supabase"
import { useIdle } from "@vueuse/core"
import { state } from "@/store"
import { useRouter } from "vue-router"

const router = useRouter()
const content = ref<any>({})
const date = ref(new Date(Date.now()).toISOString().split("T")[0])
const editor = ref<Editor>()
const isPublishing = ref(false)

// highlight text function
const highlightColor = (e: InputEvent) => {
  console.log(e)
}

// upload Image
async function upload(file: File) {
  let formData = new FormData()
  formData.append("file", file)
  const randomString = (Math.random() + 1).toString(36).substring(7) + "-"
  const generateString = state.user?.id + "/" + randomString + file.name
  const headers = { "Content-Type": "multipart/form-data" }
  const dataKey = await supabase.storage.from("assets").upload(generateString, formData)

  const { data, error } = await supabase.storage.from("assets").download(generateString)

  console.log(data)
  if (data) {
    return URL.createObjectURL(data)
  } else {
    return ""
  }
}

onMounted(async () => {
  fetchContent()
  editor.value = new Editor({
    extensions: [
      createImageExtension(upload),
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Thank you for today...",
      }),
    ],
    content: "",
    autofocus: true,
    editorProps: {
      attributes: {
        class: "prose max-w-full focus:outline-none",
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
  let checker = editor.value?.getJSON().content[0].content
  if (n && !isPublishing.value && checker) {
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

// calendare event
const masks = ref({
  input: "YYYY-MM-DD",
})
const onDayClick = (day: any) => {
  console.log(day)
}
</script>

<style lang="postcss">
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
.ProseMirror img {
  @apply w-full h-full border-dark-900 border-3 rounded-xl;
}

.bubble > button {
  @apply flex items-center p-2 rounded-md hover:bg-cyan-300 transition-all ease-in-out focus:outline-none outline-none;
}
.is-active {
  @apply bg-cyan-300;
}
.vc-container {
  @apply border-3 shadow-none rounded-xl;
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
