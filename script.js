let videos = JSON.parse(localStorage.getItem("videos")) || []

const container = document.getElementById("videos")
const search = document.getElementById("search")

async function addVideo(){

let url = document.getElementById("videoLink").value

if(!url) return

let api = "https://www.youtube.com/oembed?url="+url+"&format=json"

let res = await fetch(api)
let data = await res.json()

videos.push({
title:data.title,
url:url,
thumb:data.thumbnail_url
})

localStorage.setItem("videos",JSON.stringify(videos))

document.getElementById("videoLink").value=""

showVideos(videos)

}

function playVideo(id,videoId){

document.getElementById(id).innerHTML =
`<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`

}

function deleteVideo(index){

videos.splice(index,1)

localStorage.setItem("videos",JSON.stringify(videos))

showVideos(videos)

}

function showVideos(list){

container.innerHTML=""

list.forEach((v,i)=>{

let videoId = v.url.split("v=")[1]

container.innerHTML +=
`
<div class="video">

<h3>${v.title}</h3>

<div id="player${i}">
<img src="${v.thumb}" class="thumbnail"
onclick="playVideo('player${i}','${videoId}')">
</div>

<br>

<button onclick="deleteVideo(${i})">Delete</button>

</div>
`
})

}

search.addEventListener("keyup",()=>{

let text = search.value.toLowerCase()

let filtered = videos.filter(v =>
v.title.toLowerCase().includes(text)
)

showVideos(filtered)

})

showVideos(videos)
