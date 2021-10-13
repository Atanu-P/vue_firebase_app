<template>
	<div id="display" class="container" :key="$route.fullPath" >
		<h1>{{ name}} logged-in</h1>

		<table class="striped">
			<tbody>
				<tr>
					<th>Name</th>
					<td>{{name}}</td>
					
				</tr>
				
				
				<tr>
					<th>Email</th>
					<td>{{email}}</td>
					
				</tr>
				<tr>
					<th>Mobile No</th>
					<td>{{ mob_no }}</td>
					
				</tr>
				
			</tbody>
		</table>
		<hr>
		<div class="row">
			<div class="col s6">
				<Email :name="name" :email="email" @refresh="refresh"/>
				<h5 class="helper-text green-text" v-if="feedback">{{feedback}}</h5>
			</div>
			<div class="col s6" >
				<h3>Mail list</h3>
				<input type="date" name="" v-model="filter_by_date" >
				<div class="col s6" >
					<table class="striped">
						<tbody>
							<tr>
								<th>Sent email to</th>
								<th>Date</th>
							</tr>
							<tr v-for="mail in mail_sent_filter" :key="mail.id">
								<td>{{ mail.to }}</td>
								<td>{{ mail.date }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="col s6" >
					<table class="striped">
						<tbody>
							<tr>
								<th>Recieved email from</th>
								<th>Date</th>
							</tr>
							<tr v-for="mail in mail_recived_filter" :key="mail.id">
								<td>{{ mail.from }}</td>
								<td>{{ mail.date }}</td>
							</tr>
						</tbody>
					</table>
				</div><!-- <button @click="updat">updat</button> -->
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import app from "@/firebaseconfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, collection, query, where, getDocs, orderBy, onSnapshot} from "firebase/firestore";
import Email from "./Email";
const db = getFirestore(app);
export default {
	name: 'Display',
	data(){
		return {
			name: '',
			email: '',
			mob_no: '',
			mail_sent: [],
			mail_recived: [],
			feedback:'',
			filter_by_date:'',	
		}
	},
	components:{
		Email
	},
	methods: {
		refresh(data){
			this.feedback = data;
			//this.feedback = null;
			//alert(this.feedback);
			//window.location.reload();
			//this.$forceUpdate();
		},
	},
	computed:{
		///////////////////////////////////////////////////////////////////////////////
		mail_sent_filter(){
			
			let mail_sent = this.mail_sent;

			if(this.filter_by_date){
				//	show email list with filter
				let d = new Date(this.filter_by_date);
				//console.log(d.toLocaleDateString('en-GB'));
				return mail_sent.filter((mail)=>{
					
					return mail.date == d.toLocaleDateString('en-GB')
					//console.log("inside",mail);
				});
			} else {
				console.log("from filter", mail_sent);
				//	show email list without filter
				return mail_sent;
			}
		},
		///////////////////////////////////////////////////////////////////////////////
		mail_recived_filter(){
			
			let mail_recived = this.mail_recived;

			if(this.filter_by_date){
				//	show email list with filter
				let d = new Date(this.filter_by_date);
				//console.log(d.toLocaleDateString('en-GB'));
				return mail_recived.filter((mail)=>{
					return mail.date == d.toLocaleDateString('en-GB')
					//console.log("inside",mail);
				});
			} else {
				console.log("from recived filter", mail_recived);
				//	show email list without filter
				return mail_recived;
			}
		}
	},
	async created(){
		const auth = getAuth();
		const user = auth.currentUser;
		///////////////////////////////////////////////////////////////////////////////
		// Display logged in user data
		///////////////////////////////////////////////////////////////////////////////
		if(user !== null){
			console.log(user.uid, user.email, user.displayName, user.emailVerified );
			this.name = user.displayName;
			this.email = user.email;
			//console.log(this.name, this.email);
		}
		///////////////////////////////////////////////////////////////////////////////
		const docRef = doc(db, "users", user.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
		    //console.log("Firestore data :", docSnap.data());
		    const data = docSnap.data();
		    this.mob_no = data.mob_no;
		  // console.log(data.mob_no);
		} else {
		  // doc.data() will be undefined in this case
		    console.log("No such document!"); 	
		} 	
 	
		///////////////////////////////////////////////////////////////////////////////
		// Sent mail list
		/////////////////////////////////////////////////////////////////////////////// 	
		const q1 = query(collection(db, "email"), where("from", "==", this.email), orderBy("date")); 	

				// const querySnapshot1 = await getDocs(q1);
				// querySnapshot1.forEach((doc) => {
				//   // doc.data() is never undefined for query doc snapshots
				//   //console.log(doc.id, " => ", doc.data());

				//   let data = doc.data();
				//   data.id = doc.id;
				//   data.date = data.date.toDate().toLocaleDateString('en-GB');
				//   this.mail_sent.push(data);
				//   // console.log(data.date.toDate());
				// });

		const onsnapshot1 = onSnapshot(q1, (snapshot) => {
		  snapshot.docChanges().forEach((change) => {
		    if (change.type === "added") {
		        	let data = change.doc.data();
		        	data.id = change.doc.id;
		        	data.date = data.date.toDate().toLocaleDateString('en-GB');
		        	this.mail_sent.unshift(data);
		        //console.log("Change Doc *", change.doc.data());
		    }
		  });
		});
		//console.log(this.mail_sent);
		
		///////////////////////////////////////////////////////////////////////////////
		// Recevied mail list 
		///////////////////////////////////////////////////////////////////////////////
		const q2 = query(collection(db, "email"), where("to", "==", this.email), orderBy("date"));

				// const querySnapshot2 = await getDocs(q2);
				// querySnapshot2.forEach((doc) => {
				//   // doc.data() is never undefined for query doc snapshots
				//   //console.log(doc.id, " => ", doc.data());

				//   let data = doc.data();
				//   data.id = doc.id;
				//   data.date = data.date.toDate().toLocaleDateString('en-GB');	  
				//   this.mail_recived.push(data);
				  
				// });

		const onsnapshot2 = onSnapshot(q2, (snapshot) => {
		  snapshot.docChanges().forEach((change) => {
		    if (change.type === "added") {
		        	let data = change.doc.data();
		        	data.id = change.doc.id;
		        	data.date = data.date.toDate().toLocaleDateString('en-GB');
		        	this.mail_recived.unshift(data);

		        //console.log("Change Doc to *", change.doc.data());
		    }
		  });
		});
		//console.log(this.mail_recived);
	},
}
</script>