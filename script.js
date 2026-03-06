const links = [

"https://www.youtube.com/watch?v=qz0aGYrrlhU",
"https://www.youtube.com/watch?v=W6NZfCO5SIk",
"https://www.youtube.com/watch?v=yfoY53QXEnI"

]

const container = document.getElementById("videos")
const search = document.getElementById("search")

let videoData=[]

async function loadVideos(){

for(let url of links){

let api = "https://www.youtube.com/oembed?url="+url+"&format=json"

let res = await fetch(api)
let data = await res.json()

videoData.push({
title:data.title,
url:url
})

}

showVideos(videoData)

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

let filtered = videoData.filter(v =>
v.title.toLowerCase().includes(text)
)

showVideos(filtered)

})

loadVideos()
