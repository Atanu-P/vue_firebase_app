import Vue from 'vue'
import VueRouter from 'vue-router'
import app from "@/firebaseconfig"
import { getAuth } from "firebase/auth"
//import Home from '../views/Home.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Display from '../components/Display.vue'
import Image_upload from '../components/Image_upload.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/',
    component: Login
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/display',
    name: 'Display',
    component: Display,
    meta:{
      requiresAuth: true
    }
  },
    {
    path: '/image_upload',
    name: 'Image_upload',
    component: Image_upload,
    meta:{
      requiresAuth: true
    }
  },
  
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const requiresauth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresauth && !user) next('login');
  else if(!requiresauth && user) next('/display');
  else next();

});

export default router
