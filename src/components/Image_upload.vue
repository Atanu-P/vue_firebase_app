<template>
	<div id="image_upload">
		<h3>Image upload</h3>
		<input type="file" accept="image/*" @change="choose_image">
		
		<button type="submit" @click="upload_image">Upload</button><br><br>
		
			<img :src="preview" style="width: 400px"/>

			<h5 class="helper-text green-text" v-if="feedback && check != 0">{{feedback}}</h5>
			<h5 class="helper-text red-text" v-else>{{feedback}}</h5>
		<hr>
		<div class="image">
			<div v-for="image in images" :key="image.id">
			<img :src="image" style="width: 350px">
			<br><br>
			<button class="waves-effect waves-red btn-flat" @click="delete_image(image)">Delete</button>
			</div>

		</div>
		
		
	</div>
	
</template>

<script>
import app from "@/firebaseconfig";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL ,deleteObject ,toString} from "firebase/storage";
//import { getAuth, onAuthStateChanged } from "firebase/auth"

export default {
	name: 'Image_upload',
	data(){
		return{
			preview : null,
			//imageurl : null,
			imagefile : null,
			feedback: null,
			check:0,
			allimages:[]
		}
	},
	computed:{
		images(){
			if(this.allimages){
				return this.allimages;
			}
			
		}
	},
	methods:{
		choose_image(e){
			console.log(e.target.files[0]);
			const image = e.target.files[0];
			this.imagefile = image;
			
			if(this.imagefile.type == "image/jpeg"  || this.imagefile.type == "image/png"){
				//console.log();
				const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    this.preview = e.target.result;
                    //this.imageurl = URL.createObjectURL(image);
                    //console.log(this.preview);
                    //console.log(this.imageurl);
                };
			} else {
				alert("Only jpeg && png are allowed !!")
				this.imagefile = null;
				this.preview = null;
			} 
			           
            this.feedback = null;
		},
		async upload_image(){
			const storage = getStorage();
			//console.log(storage);
			if(this.imagefile){
				const imageref = ref(storage, 'images/'+this.imagefile.name);
				//console.log(imageref);

				await uploadBytes(imageref, this.imagefile).then((snapshot) => {
				  	console.log(snapshot);
				  	this.feedback = this.imagefile.name+" successfully uploaded !!"
				  	this.check = 1;
				});

				getDownloadURL(imageref)
			     	.then((url)=>{
				      	//console.log(url);
				      	this.allimages.push(url);
				      	
			    	})
			     	.catch((error) => {
					    // Handle any errors
					    console.log(error);
					});
				
			} else {
				this.feedback = "Image file not supported !!"
				this.check = 0;
			}
		},
		fetch_image(){
			const storage = getStorage();

			// Create a reference under which you want to list
			const listRef = ref(storage, 'images');

			// Find all the prefixes and items.
			listAll(listRef)
			.then((res) => {
			   	res.items.forEach((itemRef) => {
			    // All the items under listRef.
				    //console.log("Firebase images ",itemRef);
				    getDownloadURL(itemRef)
			     	.then((url)=>{
				      	//console.log(url);
				      	this.allimages.push(url);
				      	
			    	})
			     	.catch((error) => {
					    // Handle any errors
					    console.log(error);
					});
			    });
			})
			.catch((error) => {
			    // Uh-oh, an error occurred!
			    console.log(error);
			});
			//console.log("Array of images ",this.allimages)
		},

		delete_image(url){
			const storage = getStorage();
			let pictureRef = ref(storage, url);
			//console.log(getDownloadURL(pictureRef));
			//console.log(url)
			////////////////////////////////////////////////////
			// remove image url from array
			////////////////////////////////////////////////////
			// getDownloadURL(pictureRef)
			//      	.then((url)=>{
			// 	      	//console.log(url);
				      	
				      	
			//     	})
			//      	.catch((error) => {
			// 		    // Handle any errors
			// 		    console.log(error);
			// 		});
			/////////////////////////////////////////////////////

			//Delete the file
			deleteObject(pictureRef).then(() => {
			  // File deleted successfully
			  this.allimages.filter((image) => {
			  	return image.url == pictureRef.url;
			  });
			  alert("Image successfully deleted !!");

			}).catch((error) => {
			  // Uh-oh, an error occurred!
			  console.log(error);
			});

		}
	},

	created(){
		this.fetch_image();
	}
}
</script>

<style>
.image{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  margin-top: 10px;
}
</style>


