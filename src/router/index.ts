import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from '../components/welcome/Welcome.vue'
import TokenPairs from '../components/tokenpairs/TokenPairs.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { 
      path: '/welcome', 
      component: Welcome 
    },
    { 
      path: '/tokenpairs', 
      component: TokenPairs, 
      meta: {
        plainLayout: true,
      }, 
    }
  ]
})