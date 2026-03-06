let videos = JSON.parse(localStorage.getItem("videos")) || []

const container = document.getElementById("videos")
const search = document.getElementById("search")

async function addVideo(){

const url = document.getElementById("videoLink").value

if(!url) return

let api = "https://www.youtube.com/oembed?url="+url+"&format=json"

let res = await fetch(api)
let data = await res.json()

videos.push({
title:data.title,
url:url
})

localStorage.setItem("videos",JSON.stringify(videos))

document.getElementById("videoLink").value=""

showVideos(videos)

}

function showVideos(list){

container.innerHTML=""

list.forEach(v=>{

let id = v.url.split("v=")[1]

container.innerHTML += `
<div class="video">
<h3>${v.title}</h3>
<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
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
