import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home/Home.vue"),
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/Home/Dashboard.vue")
      },
      {
        path: "projectBoard",
        name: "ProjectBoard",
        component: () => import("../views/Home/ProjectBoard.vue")
      },
      {
        path: "taskBoard",
        name: "TaskBoard",
        component: () => import("../views/Home/TaskBoard.vue")
      },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // use isAuthenticated for debugging
  // set false for debugging
  // set true for development
  let isAuthenticated = true
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next();

});

export default router;
