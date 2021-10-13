<template>
	<div class="register container">
		<h3 class="red-text lighten-4">Registration</h3>
		<div class="row">
			<form id="registerForm"class="col s12" @submit.prevent="register">
				<div class="row">
					<div class="input-field col s6">
						<input  id="first_name" type="text" class="validate" v-model="first_name">
						<label for="first_name">First Name</label>
						<div v-if="$v.first_name.$error">
							<span class="helper-text red-text"  v-if="!$v.first_name.required">First name required</span>
							<span class="helper-text red-text"  v-if="!$v.first_name.alpha">Invalid input !! Only A-Z & a-z allowed</span>
						</div>
					</div>
					<div class="input-field col s6">
						<input id="last_name" type="text" class="validate" v-model="last_name">
						<label for="last_name">Last Name</label>
						<div v-if="$v.last_name.$error">
							<span class="helper-text red-text"  v-if="!$v.last_name.required">Last name required</span>
							<span class="helper-text red-text"  v-if="!$v.last_name.alpha">Invalid input !! Only A-Z & a-z allowed</span>
						</div>
					</div>
				</div>
				
				<div class="row">
					<div class="input-field col s6">
						<input id="email" type="text" class="validate" v-model="email">
						<label for="email">Email</label>
						<div v-if="$v.email.$error">
							<span class="helper-text red-text"  v-if="!$v.email.required">Email is required</span>
							<span class="helper-text red-text"  v-if="!$v.email.email">Email is invalid !! e.g 'xyz@gmail.com'</span>
						</div>
					</div>
					
					<div class="input-field col s6">
						<input id="tel" type="tel" class="validate" v-model="mob_no">
						<label for="tel">Mobile Number</label>
						<div v-if="$v.mob_no.$error">
							<span class="helper-text red-text"  v-if="!$v.mob_no.required">Mobile number is required</span>
							<span class="helper-text red-text"  v-else-if="!$v.mob_no.numeric">Invalid input !! e.g '888-999-0000'</span>
							<!-- <span class="helper-text red-text"  v-if="!$v.mob_no.between">Invalid mobile no</span> -->
							<span class="helper-text red-text"  v-else-if="!$v.mob_no.maxLength">Invalid mobile number !! e.g '888-999-0000'</span>
							<span class="helper-text red-text"  v-else-if="!$v.mob_no.minLength">Invalid mobile number !! e.g '888-999-0000'</span>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="input-field col s12">
						<input id="password" type="password" class="validate" v-model="password">
						<label for="password">Password</label>
						<div v-if="$v.password.$error">
							<span class="helper-text red-text"  v-if="!$v.password.required">Password required</span>
							<span class="helper-text red-text"  v-else-if="!$v.password.containsUppercase">Password must contain at least one uppercase letter A-Z</span>
							<span class="helper-text red-text"  v-else-if="!$v.password.containsLowercase">Password must contain at least one lower letter a-z</span>
							<span class="helper-text red-text"  v-else-if="!$v.password.containsNumber">Password must contain at least one 0-9</span>
							<span class="helper-text red-text"  v-else-if="!$v.password.containsSpecial">Password must contain at least one special character</span>
							<span class="helper-text red-text"  v-else-if="!$v.password.minLength">Password must be at least 6 characters</span>

						</div>
						
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<input id="con_password" type="password" class="validate" v-model="con_password">
						<label for="con_password">Confirm-Password</label>
						<div v-if="$v.con_password.$error">
							<span class="helper-text red-text"  v-if="!$v.con_password.required">Confirm Password is required</span>
							<span class="helper-text red-text"  v-else-if="!$v.con_password.minLength">Passwords must match</span>
						</div>
					</div>
				</div>
								
				<!-- <span class="helper-text green-text"  if="feedback">{{ feedback }}</span> -->	
				
				<div class="field center-align">
					<!--p v-if="feedback" class="red-text">{{ feedback }}</p-->
					<br>
					<button class="btn" >Register</button>

				</div>
			</form>
		</div>
	</div>
</template>

<script type="text/javascript">
import app from "@/firebaseconfig";
import { getAuth, createUserWithEmailAndPassword , sendEmailVerification , updateProfile , signOut } from "firebase/auth";
import { doc, setDoc , getFirestore} from "firebase/firestore";
import { required, email, minLength, sameAs, numeric, alpha, maxLength } from 'vuelidate/lib/validators';

const db = getFirestore(app);
export default {
	name: 'Register',

	data(){
		return{
			
			first_name: '',
			last_name:'',
			email:'',
			mob_no:'',
			password:'',
			con_password:'',
			// feedback:''
		}
	},

	validations: {
	 	first_name: {required,alpha},
		last_name: {required, alpha},
		email : {required, email},
		mob_no: {required, numeric, maxLength: maxLength(10), minLength: minLength(10)},
		password: { required, 
					minLength: minLength(6),
					containsUppercase: function(value) {
				      return /[A-Z]/.test(value)
				    },
				    containsLowercase: function(value) {
				      return /[a-z]/.test(value)
				    },
				    containsNumber: function(value) {
				      return /[0-9]/.test(value)
				    },
				    containsSpecial: function(value) {
				      return /[#?!@$%^&*-]/.test(value)
				    }
				},
		con_password : { required, sameAsPassword: sameAs('password') }
	},

	methods:{

		register(){

			this.$v.$touch();

            if (!this.$v.$invalid) {
                
            	const auth = getAuth();
            	const user = auth.currentUser;	
				//console.log(auth);

				createUserWithEmailAndPassword(auth, this.email, this.password)
				.then((userCredential) => {
				    // Signed in 
				    //const user = userCredential.user;
				    
				    updateProfile(userCredential.user, {
					  displayName: this.first_name+" "+this.last_name, 
					  //phoneNumber: this.mob_no
					})
				    
			     	setDoc(doc(db, "users", userCredential.user.uid), {
					  first_name: this.first_name,
					  last_name:  this.last_name,
					  email:      userCredential.user.email,
					  mob_no:     this.mob_no
					});

					sendEmailVerification(auth.currentUser)
					  .then(() => {
					    // Email verification sent!
					    // ...
					    registerForm.reset();
					    console.log('email sent');
					    // this.feedback = "New user successfully registerd !";
					    alert("New user successfully registerd ! verification email sent !!");
					    signOut(auth).then(() => {
						  // Sign-out successful.
						  console.log('logout');
						  //this.$router.go({ path: this.$rouer.path });
						  //this.$router.replace('login');
						})
					});
				})
				.catch((error) => {
				    const errorCode = error.code;
				    const errorMessage = error.message;
				    if(errorMessage  === "Firebase: Error (auth/email-already-in-use)."){
				    	alert("Email already exist !! Use different email !!");
				    }
				    // ..
				});

            } else {
            	return;
            }
       	}
	}
}
</script>