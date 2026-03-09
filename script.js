import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

function getID(url){
return url.split("v=")[1]?.split("&")[0]||url.split("/").pop()
}

async function fetchTitle(url){

try{
const res=await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`)
const data=await res.json()
return data.title
}catch{
return "YouTube Video"
}

}

window.addVideo=async function(){

if(!user || user.email!==ADMIN_EMAIL){
alert("Admin only")
return
}

const link=document.getElementById("videoLink").value

if(!link) return

const title=await fetchTitle(link)

await addDoc(collection(db,"videos"),{
url:link,
title:title,
created:Date.now()
})

document.getElementById("videoLink").value=""

}

function play(url){

const id=getID(url)

document.getElementById("player").innerHTML=
`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`

}

const videosDiv=document.getElementById("videos")

const q=query(collection(db,"videos"),orderBy("created","desc"))

onSnapshot(q,(snapshot)=>{

videosDiv.innerHTML=""

snapshot.forEach(d=>{

const v=d.data()

const id=getID(v.url)

const thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`

videosDiv.innerHTML+=`

<div class="videoCard">

<img src="${thumb}" onclick="play('${v.url}')">

<p>${v.title}</p>

<button onclick="deleteVideo('${d.id}')">Delete</button>

</div>

`

})

})

window.deleteVideo=async function(id){

if(!user || user.email!==ADMIN_EMAIL){
alert("Admin only")
return
}

await deleteDoc(doc(db,"videos",id))

}

document.getElementById("search").addEventListener("keyup",function(){

const text=this.value.toLowerCase()

document.querySelectorAll(".videoCard").forEach(v=>{

v.style.display=v.innerText.toLowerCase().includes(text)?"block":"none"

})

})

window.toggleDark=function(){

document.body.classList.toggle("dark")

}
