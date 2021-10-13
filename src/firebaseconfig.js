// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBpruValZV_trlVvh6qmbZej6BP1Qgo0EM",

  authDomain: "vue-authentication-f649e.firebaseapp.com",

  projectId: "vue-authentication-f649e",

  storageBucket: "vue-authentication-f649e.appspot.com",

  messagingSenderId: "808538763097",

  appId: "1:808538763097:web:ef95d7eb17d9f345bc2648"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export default app