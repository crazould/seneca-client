import Vue from "vue";
import VueRouter from "vue-router";
// import { trailingSlash } from "@/util/helpers";
import { layout, route } from "@/util/routes";

Vue.use(VueRouter);

const routes = [
  layout("Default", [
    route("Dashboard"),
    route("Projects", null, "project-board"),
    route("Task Board", null, "task-board"),
    route("Notifications", null, "notifications"),
    route("Discussion", null, "discussion"),
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

router.beforeEach( function(to, from, next) {

  let isSessionExists = JSON.parse(localStorage.getItem('vue-session-key')) ? true : false;
  let isAuthenticated = false
  
  if(isSessionExists){
    isAuthenticated = JSON.parse(localStorage.getItem('vue-session-key')).user ? true : false;
  }

  if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
  else if(to.name === "Login" && isAuthenticated) next({ name: "Dashboard" });
  else return next();


});

export default router;
