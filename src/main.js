import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入模块
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
// 进度条样式
import 'nprogress/nprogress.css'
// 导入全局样式
import './styles/index.css'
import axios from 'axios'
Vue.prototype.$http = axios
// 挂载模块
Vue.use(ElementUI)

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
