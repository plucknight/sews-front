import { createRouter, createWebHistory } from "vue-router";
// import Login from '../views/Login.vue'
// const Login = () => import("../views/UserLogin.vue");
const WeatherData = () => import("../views/WeatherData.vue");
// const Home = () => import("../views/Home.vue")
const Index = () => import("../views/index.vue");
// import Device from '../views/Device.vue'
const Device = () => import("../views/Device.vue");

const Admin = () => import("../views/Admin.vue");
const DeviceList = () => import("../views/DeviceList.vue");

const ModelChose = () => import("../views/ModelChose.vue");

const WarningRelus = () => import("../views/WarningRelus.vue");
const WarningInfo = () => import("../views/WarningInfo.vue");

// import Monitor from '../views/Monitor.vue'
const Monitor = () => import("../views/Monitor.vue");
const DeviceMaintenance = () => import("../views/DeviceMaintenance.vue");
// import Help from '../views/Help.vue'
const Help = () => import("../views/Help.vue");
const AdminPermission = () => import("../views/AdminPermission.vue");

const Photo = () => import("../views/Photo.vue");
const Map = () => import("../views/Map.vue");

const routes = [
  {
    path: "/home",
    name: "home",
    component: Device,
    children: [
      { path: "/home", redirect: "/home/index" },
      { path: "/home/devicelist", name: "devicelist", component: DeviceList },
      { path: "/home/deviceMaintenance", component: DeviceMaintenance },
      {
        path: "/home/index",
        component: Index,
      },
      {
        path: "/home/admin",
        component: Admin,
      },
      {
        path: "/home/weatherdata",
        component: WeatherData,
      },
      {
        path: "/home/warningRelus",
        component: WarningRelus,
      },
      {
        path: "/home/warningInfo",
        component: WarningInfo,
      },
      { path: "/home/monitor", name: "monitor", component: Monitor },

      { path: "/home/photo", name: "photo", component: Photo },
      { path: "/home/modelchose", name: "ModelChose", component: ModelChose },

      { path: "/home/adminPermission", component: AdminPermission },
    ],
  },
  { path: "/", redirect: "/map" },
  // { path: "/login", name: "login", component: Login },
  // { path: '/home', name: 'home', component: Home },

  { path: "/help", name: "help", component: Help },
  {
    path: "/map",
    name: "map",
    component: Map,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   window.document.title = "作物靶标害虫自动监测预警系统";
//   next();
// });

export default router;
