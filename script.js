import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const ADMIN_EMAIL="bhuvanmambhore@email.com"

const firebaseConfig={
apiKey:"AIzaSyC6K2g9iMqZkQg8QJV1dU_dqpQXjmcqfPY",
authDomain:"mytube-pro-8574b.firebaseapp.com",
projectId:"mytube-pro-8574b",
storageBucket:"mytube-pro-8574b.firebasestorage.app",
messagingSenderId:"257345211479",
appId:"1:257345211479:web:de0b2e790a4d4dc4642712"
}

const app=initializeApp(firebaseConfig)
const db=getFirestore(app)
const auth=getAuth(app)

let user=null

window.login=async function(){

const provider=new GoogleAuthProvider()
const result=await signInWithPopup(auth,provider)

user=result.user

alert("Logged in as "+user.email)

}

window.addVideo=async function(){

if(!user || user.email!==ADMIN_EMAIL){
alert("Only admin can add videos")
return
}

const link=document.getElementById("videoLink").value

if(!link) return

const id=link.split("v=")[1]?.split("&")[0]||link.split("/").pop()

await addDoc(collection(db,"videos"),{
url:link,
title:"YouTube Video",
created:Date.now()
})

document.getElementById("videoLink").value=""

}

function play(url){

const id=url.split("v=")[1]?.split("&")[0]||url.split("/").pop()

document.getElementById("player").innerHTML=
`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`

}

const videosDiv=document.getElementById("videos")

const q=query(collection(db,"videos"),orderBy("created","desc"))

onSnapshot(q,(snapshot)=>{

videosDiv.innerHTML=""

snapshot.forEach(d=>{

const v=d.data()

const id=v.url.split("v=")[1]?.split("&")[0]||v.url.split("/").pop()

const thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`

videosDiv.innerHTML+=`

<div class="video">

<img src="${thumb}" onclick="play('${v.url}')">

<br>

<button onclick="deleteVideo('${d.id}')">Delete</button>

</div>

`

})

})

window.deleteVideo=async function(id){

if(!user || user.email!==ADMIN_EMAIL){
alert("Only admin can delete")
return
}

await deleteDoc(doc(db,"videos",id))

}

document.getElementById("search").addEventListener("keyup",function(){

const text=this.value.toLowerCase()

document.querySelectorAll(".video").forEach(v=>{

v.style.display=v.innerText.toLowerCase().includes(text)?"block":"none"

})

})
