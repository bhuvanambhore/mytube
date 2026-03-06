let videos = JSON.parse(localStorage.getItem("videos")) || []

const grid = document.getElementById("videoGrid")
const search = document.getElementById("search")
const categoryFilter = document.getElementById("categoryFilter")

function extractID(url){
return url.split("v=")[1]?.split("&")[0]
}

async function addVideo(){

let url=document.getElementById("videoLink").value
let category=document.getElementById("videoCategory").value

if(!url) return

let api=`https://www.youtube.com/oembed?url=${url}&format=json`
let res=await fetch(api)
let data=await res.json()

videos.unshift({
title:data.title,
url:url,
category:category,
thumb:data.thumbnail_url
})

localStorage.setItem("videos",JSON.stringify(videos))

updateCategories()
showVideos(videos)

}

function showVideos(list){

grid.innerHTML=""

list.forEach((v,i)=>{

grid.innerHTML+=`

<div class="videoCard" onclick="playVideo('${v.url}')">

<img src="${v.thumb}">

<div class="videoTitle">

${v.title}

<br>
<small>${v.category||""}</small>

</div>

</div>

`

})

}

function playVideo(url){

let id=extractID(url)

document.getElementById("player").innerHTML=
`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`

document.getElementById("playerModal").style.display="block"

}

function closePlayer(){
document.getElementById("playerModal").style.display="none"
document.getElementById("player").innerHTML=""
}

function updateCategories(){

let cats=[...new Set(videos.map(v=>v.category).filter(Boolean))]

categoryFilter.innerHTML='<option value="">All</option>'

cats.forEach(c=>{
categoryFilter.innerHTML+=`<option>${c}</option>`
})

}

function filterVideos(){

let text=search.value.toLowerCase()
let cat=categoryFilter.value

let filtered=videos.filter(v=>
v.title.toLowerCase().includes(text) &&
(cat=="" || v.category==cat)
)

showVideos(filtered)

}

search.addEventListener("keyup",filterVideos)
categoryFilter.addEventListener("change",filterVideos)

function toggleDark(){
document.body.classList.toggle("dark")
}

updateCategories()
showVideos(videos)
