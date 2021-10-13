<template>
  <div id="app">
    <Navbar :key="$route.fullPath" />
    
    <router-view />
  </div>
</template>

<script>
import Navbar from  './components/Navbar.vue'
import app from "@/firebaseconfig";
import { getAuth } from "firebase/auth";

export default {
  name : 'app',
  components: {
    Navbar
  },
  data(){
    return{
      // loggedin: false,
      // currentuser: false
    }
  },
  // created(){
  //   const auth = getAuth();
    
  //   console.log(auth.currentUser)

  //   if(auth.currentUser){
  //     this.loggedin = true;
  //     this.currentuser = auth.currentUser.email;
  //   }

  //   console.log("app",this.loggedin,  this.currentuser)
  // }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
