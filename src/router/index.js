import { createRouter, createWebHistory } from "vue-router";
// import Login from '../views/Login.vue'
const Login = () => import("../views/UserLogin.vue");
const Test = () => import("../views/Test.vue");
// const Home = () => import("../views/Home.vue")
const Index = () => import("../views/index.vue");
// import Device from '../views/Device.vue'
const Device = () => import("../views/Device.vue");

const PestData = () => import("../views/PestData.vue"); // import DeviceList from '../views/DeviceList.vue'
const DeviceList = () => import("../views/DeviceList.vue");

const ModelChose = () => import("../views/ModelChose.vue");

const EarlyWarning = () => import("../views/EarlyWarning.vue");
// import Monitor from '../views/Monitor.vue'
const Monitor = () => import("../views/Monitor.vue");

// import Help from '../views/Help.vue'
const Help = () => import("../views/Help.vue");

const Photo = () => import("../views/Photo.vue");
const Map = () => import("../views/Map.vue");

const routes = [
  {
    path: "/home",
    name: "home",
    component: Device,
    children: [
      { path: "/home", redirect: "/home/index" },
      { path: "/home/pestdata", component: PestData },
      { path: "/home/devicelist", name: "devicelist", component: DeviceList },
      {
        path: "/home/index",
        component: Index,
      },
      {
        path: "/home/test",
        component: Test,
      },
      {
        path: "/home/earlywarning",
        component: EarlyWarning,
      },
      { path: "/home/monitor", name: "monitor", component: Monitor },

      { path: "/home/photo", name: "photo", component: Photo },
      { path: "/home/modelchose", name: "ModelChose", component: ModelChose },
    ],
  },
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  // { path: '/home', name: 'home', component: Home },

  { path: "/help", name: "help", component: Help },
  { path: "/map", name: "map", component: Map },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
