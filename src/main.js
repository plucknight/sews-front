import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

const app = createApp(App)

import 'view-ui-plus/dist/styles/viewuiplus.css'

// vant样式库
import 'vant/lib/index.css';
// 按钮
import { Button } from 'vant';
import { Icon } from 'vant';
app.use(Button).use(Icon)

// datav
import DataVVue3 from '@kjgl77/datav-vue3'
app.use(DataVVue3)


// 全局挂载axios
// app.config.globalProperties.axios = axios;

//默认请求地址
axios.defaults.baseURL = 'https://54549fz601.zicp.fun'

import animated from 'animate.css'
app.use(animated)

//配置请求拦截器
// axios.interceptors.request.use(config => {
//     // let token = localStorage.getItem("token");
//     // if (token) {
//     //     config.headers.token = token;
//     // }
//     // config.headers.Authorization = 'Bearer xxx'

//     return config
// }), erron => {
//     return Promise.reject(erron)
// }

// //配置响应拦截器
// axios.interceptors.response.use(response => {
//     // let status = response.data.code;
//     // if (status == 200) {
//     //     return response
//     // }
//     return response
// })

//通过proxy解决跨域问题（仅开发阶段生效）
//axios.defaults.baseURL = 'http://localhost:8080'
//通过this.axios({
// type:'xxx',
// url:'xxx'
// })
//发现接口不存在，把请求转交给proxy代理
//自动替换为devServer.proxy的值，发送请求
//请求数据，转发给axios

app.use(store).use(router).mount('#app')
