import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'

import app from "@/firebaseconfig"
import { getAuth, onAuthStateChanged } from "firebase/auth"


Vue.use(Vuelidate)

Vue.config.productionTip = false

//export const bus = new Vue();
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user logged in: ', user)
    const uid = user.uid;
    // ...
  } else {
    console.log('user logged out')
    // ...
    
  }
});

let vue_app ='';
onAuthStateChanged(auth, () => {
  if(!vue_app){
    vue_app = new Vue({
                router,
                render: h => h(App)
              }).$mount('#app')
  }
});


