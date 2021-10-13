<template>
	<div class="login container">
		<h3 class="red-text lighten-4">Log In</h3>
		<div class="row">
			<form class="col s12" @submit.prevent="login">
							
				<div class="row">
					<div class="input-field col s12">
						<input id="email" type="text" class="validate" v-model="email">
						<label for="email">Email</label>
						<div v-if="$v.email.$error && issubmitted">
							<span class="helper-text red-text"  v-if="!$v.email.required">Email is required</span>
							<span class="helper-text red-text"  v-else-if="!$v.email.email">Email is invalid</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<input id="password" type="password" class="validate" v-model="password">
						<label for="password">Password</label>
						<div v-if="$v.password.$error && issubmitted">
							<span class="helper-text red-text"  v-if="!$v.password.required">Password required</span>
						</div>
					</div>
				</div>
				<span class="helper-text red-text"  v-if="feedback">{{ feedback }}</span>			
				<div class="field center-align">
					<!--p v-if="feedback" class="red-text">{{ feedback }}</p-->
					<button class="btn" >Login</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script type="text/javascript">
import app from "@/firebaseconfig";
import { getAuth, signInWithEmailAndPassword , signOut } from "firebase/auth";
import { required, email } from 'vuelidate/lib/validators';
//import {bus} from '../main'

export default {
	name: 'Login',

	data(){
		return{
			email:'',
			password:'',
			feedback:'',
			issubmitted:false
			// loggedin: false,
			// currentuser: false
		}
	},

	validations: {
		email: { required, email },
		password: { required }
	},

	methods:{
		login(){
			this.issubmitted = true;
			this.$v.$touch();

			if (!this.$v.$invalid){

				const auth = getAuth();
				//const user = auth.currentUser;
				//const emailVerified = user.emailVerified
				signInWithEmailAndPassword(auth, this.email, this.password)
				  .then((userCredential) => {
				    // Signed in 
				    const user = userCredential.user;
				    //console.log(user + 'logged in');
				    // ...
				    console.log(userCredential);
				    if(user.emailVerified){
				    	//this.$router.push('Display');
				    	this.$router.push({ path: 'display' });

				  //   	if(auth.currentUser){
						// 	this.loggedin = true;
						// 	this.currentuser = auth.currentUser.email;
						// 	bus.$emit('logged',this.loggedin)
						// }
					} else {
				    	this.feedback="Email not verified";
				    	//console.log(auth);
				    	signOut(auth).then(() => {
						  // Sign-out successful.
						  console.log('logout');
						  //this.$router.go({ path: this.$rouer.path });
						  //this.$router.replace('login');
						})

				    }
				})
				.catch((error) => {
				    const errorCode = error.code;
				    const errorMessage = error.message;
				    //console.log(errorMessage);
				    
				    if(errorMessage === "Firebase: Error (auth/user-not-found)."){
				    	this.feedback= "User not found";
				    } else if( errorMessage === "Firebase: Error (auth/wrong-password)."){
				    	this.feedback = "Wrong password";
				    }
				    // this.feedback= errorMessage;
				    // this.feedback= null;
				});

			} else {
				
				return;
			}
		}
	}
}
</script>

