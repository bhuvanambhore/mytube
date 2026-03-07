import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyC6K2g9iMqZkQg8QJV1dU_dqpQXjmcqfPY",
authDomain: "mytube-pro-8574b.firebaseapp.com",
projectId: "mytube-pro-8574b",
storageBucket: "mytube-pro-8574b.firebasestorage.app",
messagingSenderId: "257345211479",
appId: "1:257345211479:web:de0b2e790a4d4dc4642712"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const videosDiv=document.getElementById("videos")

window.addVideo = async function(){

let link=document.getElementById("videoLink").value

if(!link) return

let id=link.split("v=")[1]?.split("&")[0]||link.split("/").pop()

await addDoc(collection(db,"videos"),{
url:link,
created:Date.now()
})

document.getElementById("videoLink").value=""

}

function play(url){

let id=url.split("v=")[1]?.split("&")[0]||url.split("/").pop()

document.getElementById("player").innerHTML=
`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`

}

const q=query(collection(db,"videos"),orderBy("created","desc"))

onSnapshot(q,(snapshot)=>{

videosDiv.innerHTML=""

snapshot.forEach(doc=>{

let v=doc.data()
let id=v.url.split("v=")[1]?.split("&")[0]||v.url.split("/").pop()

let thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`

videosDiv.innerHTML+=`
<div class="video">
<img src="${thumb}" onclick="play('${v.url}')">
</div>
`

})

})
