import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入模块
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

// 导入全局样式
import './styles/index.css'
// 挂载模块
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
