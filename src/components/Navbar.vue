<template>
	<div class="navbar">
		<nav>
			<div class="nav-wrapper container">
				<a href="#" class="brand-logo"></a>
				<ul id="nav-mobile" class="right hide-on-med-and-down">
					<li v-if="!loggedin" @click="active = 'Login'" :class="{active:active === 'Login'}"><router-link :to="{ name: 'Login' }">Login</router-link></li>
					<li v-if="!loggedin" @click="active = 'Register'" :class="{active:active === 'Register'}"><router-link :to="{ name: 'Register' }">Register</router-link></li>
					<li v-if="loggedin" @click="active = 'Home'" :class="{active:active === 'Home'}"><router-link :to="{ name: 'Display' }">Home</router-link></li>
					<li v-if="loggedin" @click="active = 'Image upload'" :class="{active:active === 'Image upload'}"><router-link :to="{ name: 'Image_upload' }">Image Upload</router-link></li>
					<li v-if="loggedin"><a href="" @click.prevent="logout">Logout</a></li>
				</ul>
			</div>
		</nav>
	</div>
</template>

<script type="text/javascript">
import app from "@/firebaseconfig";
import { getAuth, signOut } from "firebase/auth";
//import {bus} from '../main';

export default{
	name: 'Navbar',
	data(){
		return{
			active:null,
			loggedin: false,
			currentuser: false
		}
	},
	//props:['loggedin', 'currentuser'],
	created(){
		const auth = getAuth();
		
		if(auth.currentUser){
			this.loggedin = true;
			this.currentuser = auth.currentUser.email;
		}

		// bus.$on('logged',(data) =>{
		// 	this.loggedin = data;
		// 	console.log(data);
		// })

	},

	methods:{
		logout(){
			const auth = getAuth();
			signOut(auth).then(() => {
	  			// Sign-out successful.
		  		console.log('logout');
		  		//this.$router.go({ path: this.$rouer.path });
		   		this.$router.replace('login');
			}).catch((error) => {
			  	// An error happened.
			  	console.log(error);
			});
		}
	}
}
</script>
<style type="text/css">
	.router-link-exact-active{
		background: #d66367;
	}
</style>