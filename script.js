let videos=[]
const container=document.getElementById("videos")
const search=document.getElementById("search")
const filter=document.getElementById("filter")

async function loadCSV(){

let res=await fetch("videos.csv")
let text=await res.text()

let rows=text.split("\n").slice(1)

rows.forEach(r=>{

let [cat,title,url]=r.split(",")

if(!url) return

videos.push({
category:cat,
title:title,
url:url,
thumb:`https://img.youtube.com/vi/${url.split("v=")[1]}/hqdefault.jpg`
})

})

updateCategories()
showVideos(videos)

}

function updateCategories(){

let cats=[...new Set(videos.map(v=>v.category))]

cats.forEach(c=>{
filter.innerHTML+=`<option>${c}</option>`
})

}

function playVideo(id,vid){

document.getElementById(id).innerHTML=
`<iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen></iframe>`

}

function showVideos(list){

container.innerHTML=""

list.forEach((v,i)=>{

let vid=v.url.split("v=")[1]

container.innerHTML+=`
<div class="video">

<h3>${v.title}</h3>
<p>${v.category}</p>

<div id="player${i}">
<img src="${v.thumb}" class="thumbnail"
onclick="playVideo('player${i}','${vid}')">
</div>

</div>
`

})

}

search.addEventListener("keyup",filterVideos)
filter.addEventListener("change",filterVideos)

function filterVideos(){

let text=search.value.toLowerCase()
let cat=filter.value

let result=videos.filter(v=>
v.title.toLowerCase().includes(text) &&
(cat==""||v.category==cat)
)

showVideos(result)

}

loadCSV()
