const storageKey="mytube_v17"

let videos=JSON.parse(localStorage.getItem(storageKey))||[]

let currentCategory="All"



function saveVideos(){

localStorage.setItem(storageKey,JSON.stringify(videos))

}



function getID(url){

let r=/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/

let m=url.match(r)

return m?m[1]:null

}



function previewVideo(){

let url=document.getElementById("videoLink").value

let id=getID(url)

if(!id)return

let thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`

document.getElementById("preview").innerHTML=`<img src="${thumb}">`

fetch("https://noembed.com/embed?url="+url)

.then(r=>r.json())

.then(data=>{

document.getElementById("videoTitle").value=data.title

})

}



function addVideo(){

let title=document.getElementById("videoTitle").value

let url=document.getElementById("videoLink").value

let category=document.getElementById("videoCategory").value

let playlistText=document.getElementById("videoPlaylist").value

let id=getID(url)

let playlists=playlistText.split(",").map(p=>p.trim()).filter(p=>p)

let existing=videos.find(v=>v.id===id)

if(existing){

playlists.forEach(p=>{

if(!existing.playlists.includes(p)){

existing.playlists.push(p)

}

})

saveVideos()

showVideos()

return

}

videos.push({

title,

id,

category,

playlists,

favorite:false,

watched:false,

views:0

})

saveVideos()

showVideos()

}



function toggleFavorite(i){

videos[i].favorite=!videos[i].favorite

saveVideos()

showVideos()

}



function deleteVideo(i){

if(confirm("Delete video?")){

videos.splice(i,1)

saveVideos()

showVideos()

}

}



function editVideo(i){

let t=prompt("Edit title",videos[i].title)

if(t)videos[i].title=t

saveVideos()

showVideos()

}



function showVideos(){

let grid=document.getElementById("videoGrid")

grid.innerHTML=""

videos.forEach((v,i)=>{

if(currentCategory!="All" && v.category!=currentCategory)return

let thumb=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

grid.innerHTML+=`

<div class="video ${v.watched?'watched':''}">

<div class="thumbnail" onclick="playVideo('${v.id}',${i})">

<img src="${thumb}">

</div>

<div class="info">

<div class="title">${v.title}</div>

<div class="category">${v.category}</div>

<div class="playlist">${v.playlists.join(", ")}</div>

<div>

<span class="favorite" onclick="toggleFavorite(${i})">

${v.favorite?'⭐':'☆'}

</span>

<button onclick="editVideo(${i})">Edit</button>

<button onclick="deleteVideo(${i})">Delete</button>

</div>

</div>

</div>

`

})

generatePlaylists()

generateContinueWatching()

generateTrending()

}



function playVideo(id,i){

videos[i].watched=true

videos[i].views++

saveVideos()

let container=document.createElement("div")

container.style.position="fixed"

container.style.top="0"

container.style.left="0"

container.style.width="100%"

container.style.height="100%"

container.style.background="black"

container.style.zIndex="9999"

let iframe=document.createElement("iframe")

iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1`

iframe.allow="autoplay; fullscreen"

iframe.allowFullscreen=true

iframe.style.width="100%"

iframe.style.height="100%"

iframe.style.border="none"

let close=document.createElement("button")

close.innerHTML="✕ Close"

close.style.position="absolute"

close.style.top="20px"

close.style.right="20px"

close.onclick=()=>{

container.remove()

if(document.fullscreenElement)document.exitFullscreen()

}

container.appendChild(iframe)

container.appendChild(close)

document.body.appendChild(container)

container.requestFullscreen?.()

}



function generatePlaylists(){

let playlists={}

videos.forEach(v=>{

v.playlists.forEach(p=>{

if(!playlists[p])playlists[p]=[]

playlists[p].push(v)

})

})

let box=document.getElementById("playlistCards")

box.innerHTML=""

for(let name in playlists){

let first=playlists[name][0]

let count=playlists[name].length

let thumb=`https://img.youtube.com/vi/${first.id}/hqdefault.jpg`

box.innerHTML+=`

<div class="playlist-card" onclick="openPlaylist('${name}')">

<div class="playlist-thumb">

<img src="${thumb}">

<div class="overlay">▶ Play all</div>

<div class="count">${count} videos</div>

</div>

<b>${name}</b>

</div>

`

}

}



function openPlaylist(name){

let list=videos.filter(v=>v.playlists.includes(name))

let page=document.getElementById("playlistPage")

page.innerHTML=`

<h2>${name}</h2>

<div class="player" id="player"></div>

<div class="queue" id="queue"></div>

`

playVideoInline(list[0].id)

let q=document.getElementById("queue")

q.innerHTML=""

list.forEach((v,i)=>{

let thumb=`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`

q.innerHTML+=`

<div class="queue-item" onclick="playVideoInline('${v.id}')">

<img src="${thumb}">

<div>

<b>${i+1}. ${v.title}</b><br>

${v.category}

</div>

</div>

`

})

}



function playVideoInline(id){

document.getElementById("player").innerHTML=

`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>`

}



function filterCategory(cat){

currentCategory=cat

showVideos()

}



function searchVideo(){

let text=document.getElementById("search").value.toLowerCase()

document.querySelectorAll(".video").forEach(v=>{

v.style.display=v.innerText.toLowerCase().includes(text)?"block":"none"

})

}



function bulkImport(){

let lines=document.getElementById("bulkLinks").value.split("\n")

lines.forEach(link=>{

let id=getID(link)

if(id && !videos.some(v=>v.id==id)){

videos.push({

title:"Imported",

id,

category:"Education",

playlists:["Imported"],

favorite:false,

watched:false,

views:0

})

}

})

saveVideos()

showVideos()

}



function exportLibrary(){

let blob=new Blob([JSON.stringify(videos)],{type:"application/json"})

let url=URL.createObjectURL(blob)

let a=document.createElement("a")

a.href=url

a.download="mytube_backup.json"

a.click()

}



function importLibrary(){

let file=document.getElementById("importFile").files[0]

let reader=new FileReader()

reader.onload=function(e){

videos=JSON.parse(e.target.result)

saveVideos()

showVideos()

}

reader.readAsText(file)

}



function toggleDark(){

document.body.classList.toggle("dark")

}



function generateContinueWatching(){

let box=document.getElementById("continueWatching")

box.innerHTML=""

videos.filter(v=>v.watched).slice(0,6).forEach(v=>{

let thumb=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

box.innerHTML+=`

<div class="video">

<div class="thumbnail" onclick="playVideo('${v.id}',0)">

<img src="${thumb}">

</div>

<div class="info">

${v.title}

</div>

</div>

`

})

}



function generateTrending(){

let box=document.getElementById("trendingVideos")

box.innerHTML=""

let sorted=[...videos].sort((a,b)=>b.views-a.views).slice(0,6)

sorted.forEach(v=>{

let thumb=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`

box.innerHTML+=`

<div class="video">

<div class="thumbnail" onclick="playVideo('${v.id}',0)">

<img src="${thumb}">

</div>

<div class="info">

${v.title}

</div>

</div>

`

})

}



showVideos()
