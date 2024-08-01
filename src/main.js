import {createApp} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import axios from 'axios'
import router from './router/index.js';
window.axios = axios;
import dayjs from 'dayjs';
import 'dayjs/locale/vi';


const pinia = createPinia()
const app = createApp(App)
app.use(pinia);
app.use(Antd);
app.use(router);
app.config.globalProperties.$dayjs = dayjs
dayjs.locale('vi');
const token = localStorage.getItem('user_token') || sessionStorage.getItem('temporary_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
app.mount('#app')