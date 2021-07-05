import Vue from "vue";
import VueRouter from "vue-router";
// import { trailingSlash } from "@/util/helpers";
import { layout, route } from "@/util/routes";

Vue.use(VueRouter);

const routes = [
  layout("Default", [
    route("Dashboard"),
    route("Project Board", null, "project-board"),
    route("Task Board", null, "task-board"),
  ]),
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: '*',
    component: () => import('../views/Error.vue'),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;
    return { x: 0, y: 0 };
  },
  routes,
});

// router.beforeEach((to, from, next) => {
//   // use isAuthenticated for debugging
//   // set false for debugging
//   // set true for development
//   let isAuthenticated = true;
//   if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
//   else return to.path.endsWith("/") ? next() : next(trailingSlash(to.path));
// });

export default router;
