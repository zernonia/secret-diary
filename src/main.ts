import { createApp, DirectiveBinding } from "vue"
import App from "./App.vue"
import "virtual:windi.css"
import "./assets/main.css"
import "./assets/tooltip.css"
import { createRouter, createWebHistory } from "vue-router"
import router from "./router"

function init(el: Element, binding: DirectiveBinding) {
  let position = binding.arg || "top"
  let tooltipText = binding.value || "Tooltip text"
  el.setAttribute("position", position)
  el.setAttribute("tooltip", tooltipText)
}

createApp(App)
  .use(router)
  .directive("tooltip", {
    mounted(el, binding) {
      init(el, binding)
    },
    updated(el, binding) {
      init(el, binding)
    },
  })
  .mount("#app")
