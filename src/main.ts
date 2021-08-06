import { createApp, DirectiveBinding } from "vue"
import App from "./App.vue"
import "virtual:windi.css"
import "./assets/main.css"
import "./assets/tooltip.css"
import router from "./router"

import "vue-toastification/dist/index.css"
import Toast, { PluginOptions, POSITION } from "vue-toastification"

function init(el: Element, binding: DirectiveBinding) {
  let position = binding.arg || "top"
  let tooltipText = binding.value || "Tooltip text"
  el.setAttribute("position", position)
  el.setAttribute("tooltip", tooltipText)
}

const toastOptions: PluginOptions = {
  timeout: 3000,
  position: POSITION.BOTTOM_CENTER,
  toastClassName: "custom-toast",
  maxToasts: 2,
  transition: "Vue-Toastification__fade",
}

createApp(App)
  .use(router)
  .use(Toast, toastOptions)
  .directive("tooltip", {
    mounted(el, binding) {
      init(el, binding)
    },
    updated(el, binding) {
      init(el, binding)
    },
  })
  .mount("#app")
