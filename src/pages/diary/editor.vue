<template>
  <p>{{ date }}</p>
  <div class="flex space-x-4" v-if="editor">
    <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">h2</button>
    <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">h3</button>
    <button @click="editor?.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">paragraph</button>
    <button @click="editor?.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">highlight</button>
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
    </BubbleMenu>
    <editor-content :editor="editor" />
    <button class="btn flex items-center" @click="publishContent">Save <i-ic:twotone-save class="ml-2"></i-ic:twotone-save></button>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { supabase } from "@/supabase"
import { useIdle } from "@vueuse/core"
import { state } from "@/store"

const date = ref(new Date(Date.now()).toDateString())
const content = ref<Record<string, any>>({})
const editor = ref<Editor>()

onMounted(() => {
  console.log(supabase.auth.user())
  fetchContent()
  editor.value = new Editor({
    extensions: [StarterKit, TextAlign, Highlight.configure({ multicolor: true })],
    content: "Dear diary",
    autofocus: true,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const { idle, lastActive } = useIdle(1 * 1000)

watch(idle, (n) => {
  if (n) console.log("idling")
})

const fetchContent = async () => {
  const { data, error } = await supabase.from("diaries").select("*").eq("date", date.value)

  console.log(data)
}

const saveContent = async () => {
  const { data, error } = await supabase.from("diaries").upsert({
    date: date.value,
    content: editor.value?.getJSON(),
  })
}

const publishContent = () => {
  if (editor.value) {
    content.value = editor.value?.getJSON()
    console.log(content.value)
  }
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
