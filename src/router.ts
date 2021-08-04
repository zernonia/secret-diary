import routes from "virtual:generated-pages"
import { NavigationGuardNext, RouteComponent, createRouter, createWebHistory } from "vue-router"
import { state } from "./store"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to: any, from: any, next: NavigationGuardNext) => {
  if (!state.user?.id) {
    state.setUser()
  }
  if (to.name == "login" && state.user?.id) next({ name: "diary" })
  else if (to.name !== "login" && !state.user?.id) next({ name: "login" })
  else next()
})

export default router
