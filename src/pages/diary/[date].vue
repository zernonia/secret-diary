<template>
  <div class="h-full flex flex-col relative">
    <div class="flex justify-between items-center">
      <h3 class="dear-diary">Dear diary,</h3>
      <p class="border-b-3 border-dotted">{{ $route.params.date }}</p>
    </div>
    <div @scroll="scrollListener" ref="target" class="diary-page overflow-hidden overflow-y-auto">
      <editor-content :editor="editor" />
    </div>
    <teleport v-if="scrollBarShowing" to="#diary">
      <div>
        <!-- scrollbar -->
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"

import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { supabase } from "@/supabase"
import { useRoute } from "vue-router"

const route = useRoute()
const editor = ref<Editor>()
const content = ref<any>({})
const target = ref<HTMLDivElement>()

onMounted(async () => {
  fetchContent()
  editor.value = new Editor({
    editable: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose max-w-full focus:outline-none",
      },
    },
    onUpdate() {
      constructScrollBar()
    },
  })
})

const fetchContent = async () => {
  const { data, error } = await supabase.from("diaries").select("*").eq("date", route.params.date)
  if (data?.length) {
    content.value = data[0]
    editor.value?.commands.setContent(content.value.content, true)
  }
}

let maxHeight = 0
let containerHeight = 0
const scrollBarShowing = ref(false)
const constructScrollBar = () => {
  if (target.value) {
    maxHeight = target.value.scrollHeight
    containerHeight = target.value.offsetHeight

    maxHeight != containerHeight ? (scrollBarShowing.value = true) : ""
  }
}

const scrollListener = (e: MouseEvent) => {
  if (target.value) {
    const scrollPosition = target.value.scrollTop
    console.log(scrollPosition)
  }
}
</script>
