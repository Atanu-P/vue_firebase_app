<template>
<div>
    <h1></h1>
    
    
    <div class="container">
        <div class="form-container z-depth-5">
            <h3> Send email</h3>
            <div class="row">
                <form class="col s12" id="email_form" @submit.prevent="send">
                    
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="sent_to" type="text" name="sent_to"  class="" v-model="mail.to" >
                            <label for="sent_to">To</label>
                            <div v-if="$v.mail.to.$error">
                                <span class="helper-text red-text"  v-if="!$v.mail.to.required">Enter valid email id</span>
                                <span class="helper-text red-text"  v-else-if="!$v.mail.to.email">Email is invalid</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="subject" type="text" name="subject"  class="" v-model="mail.subject">
                            <label for="subject">Subject</label>
                            <div v-if="$v.mail.subject.$error">
                                <span class="helper-text red-text"  v-if="!$v.mail.subject.required">Please enter the subject</span>
                                <!-- <span class="helper-text red-text"  v-else-if="">Email is invalid</span> -->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <textarea id="mail" name="mail" class="materialize-textarea"  v-model="mail.message"></textarea>
                            <label for="mail">Message</label>
                            <div v-if="$v.mail.message.$error">
                                <span class="helper-text red-text"  v-if="!$v.mail.message.required">Please type your mail</span>
                                <!-- <span class="helper-text red-text"  v-else-if="">Email is invalid</span> -->
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="waves-effect waves-light btn submitbtn" type="submit">Send Mail</button>
                    </div>
                </form>
                
            </div>
        </div>
    </div>
    <!--Import jQuery before materialize.js-->
    <!-- <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/js/materialize.min.js"></script> -->
    
</div>
</template>
<script type="text/javascript">
import app from "@/firebaseconfig";
import { getAuth } from "firebase/auth";
import { doc, setDoc , getFirestore , updateDoc, arrayUnion , addDoc , collection , Timestamp} from "firebase/firestore";
import { required, email } from 'vuelidate/lib/validators';
const db = getFirestore(app);
export default{
    name: 'email_form',
    
    data(){
        return{
            // sent_to:'',
            // subject:'',
            // mail: '',
            mail: {
                to:"",
                subject:"",
                message:""
            },
            sent_to:[]
        }
    },
    
    props: ['name', 'email'],

    validations: {
        
        mail:{
            to:{ required, email},
            subject: {required},
            message:{required}
        }
    },

    methods:{

        reset_form(){
            this.mail.to = null,
            this.mail.subject = null,
            this.mail.message = null
        },
        
        send(){

            this.$v.$touch();

            if (!this.$v.$invalid){

                    const auth = getAuth();
                    const user = auth.currentUser;
                    ///////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////////////////////////////////////////////////
                    // console.log(this.sent_to, this.subject, this.mail);  
                        // this.map.to = this.sent_to;
                        // this.map.subject = this.subject;
                        // this.map.email = this.mail;
                        
                    //console.log(user.uid);
                    //this.sent_to.push(this.mail);
                    //console.log(this.sent_to);
                    //await updateDoc(doc(db, "users",user.uid), {
                                    //      email_sent : arrayUnion(this.mail),
                                // });
                    ///////////////////////////////////////////////////////////////////////////////
                    const docRef =  addDoc(collection(db, "email"), {
                    from:    this.email,
                    to:      this.mail.to,
                    subject: this.mail.subject,
                    message: this.mail.message,
                    date:    Timestamp.fromDate(new Date())
                    });
                    console.log("Document written with ID: ", docRef);
                    
                    this.$emit('refresh','Email sent to ' +  this.mail.to + ' !!');
                    
            } else {
                return;
            }
            this.reset_form();
            this.$v.$reset();
           //this.$forceUpdate();            
        }    
    },
    created(){
        console.log("From email component :=>", this.name, this.email);
    }
}
</script>
<style type="text/css">
    .form-container {
    width: auto;
    margin-left: auto;
    margin-right: auto;
    /*margin-top:90px;*/
    margin-bottom: 30px;
    padding: 30px;
    background-color: #fff;
    /*position: relative;
    box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 20px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.3);
    position: absolute;
    top: 50%;
    left: 50%;*/
    /*-webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);*/
}
.form-container .row {
    margin-bottom: 0;
}
/* label color */
.input-field label {
color: #9c9c9c;
}
/* label focus color */
.input-field input[type=text]:focus + label {
color: #9c9c9c;
}
/* label underline focus color */
.input-field input[type=text]:focus {
border-bottom: 1px solid #9c9c9c;
box-shadow: 0 1px 0 0 #9c9c9c;
}
/* valid color */
.input-field input[type=text].valid {
border-bottom: 1px solid #9c9c9c;
box-shadow: 0 1px 0 0 #9c9c9c;
}
/* invalid color */
.input-field input[type=text].invalid {
border-bottom: 1px solid #9c9c9c;
box-shadow: 0 1px 0 0 #9c9c9c;
}
/* icon prefix focus color */
.input-field .prefix.active {
color: #9c9c9c;
}
input:not([type]):focus:not([readonly]),
input[type=text]:focus:not([readonly]),
input[type=password]:focus:not([readonly]),
input[type=email]:focus:not([readonly]),
input[type=url]:focus:not([readonly]),
input[type=time]:focus:not([readonly]),
input[type=date]:focus:not([readonly]),
input[type=datetime]:focus:not([readonly]),
input[type=datetime-local]:focus:not([readonly]),
input[type=tel]:focus:not([readonly]),
input[type=number]:focus:not([readonly]),
input[type=search]:focus:not([readonly]),
textarea.materialize-textarea:focus:not([readonly]) {
border-bottom: 1px solid #009ddc;
box-shadow: 0 1px 0 0 #009ddc;
}
input:not([type]):focus:not([readonly])+label,
input[type=text]:focus:not([readonly])+label,
input[type=password]:focus:not([readonly])+label,
input[type=email]:focus:not([readonly])+label,
input[type=url]:focus:not([readonly])+label,
input[type=time]:focus:not([readonly])+label,
input[type=date]:focus:not([readonly])+label,
input[type=datetime]:focus:not([readonly])+label,
input[type=datetime-local]:focus:not([readonly])+label,
input[type=tel]:focus:not([readonly])+label,
input[type=number]:focus:not([readonly])+label,
input[type=search]:focus:not([readonly])+label,
textarea.materialize-textarea:focus:not([readonly])+label {
color: #009ddc;
}
.form-container .btn {
background-color: #009ddc;
}
.submitbtn {
    line-height: 48px;
    display: block;
    height: 48px;
    width: 100%;
}
.form-container h3 {
    font-size: 42px;
letter-spacing: 0.1em;
margin: 0;
padding: 0;
color: #ffffff;
font-weight: 700;
text-transform: uppercase;
position: absolute;
top: -46px;
}
@media  all and (max-width: 640px) {
    .form-container {
        position: static;
        -webkit-transform: translate(0, 0);
        -ms-transform: translate(0, 0);
        -o-transform: translate(0, 0);
        transform: translate(0, 0);
        width: 100%;
        margin-top: 70px;
        margin-bottom: 20px;
    }
    .form-container h3 {
    font-size: 24px;
    top: -26px;
    }
}
</style>