const videos = [

{
title:"Learn HTML in 10 minutes",
url:"https://www.youtube.com/watch?v=qz0aGYrrlhU"
},

{
title:"JavaScript Basics",
url:"https://www.youtube.com/watch?v=W6NZfCO5SIk"
},

{
title:"CSS Tutorial",
url:"https://www.youtube.com/watch?v=yfoY53QXEnI"
}

]

const container = document.getElementById("videos")
const search = document.getElementById("search")

function showVideos(list){

container.innerHTML=""

list.forEach(v=>{

container.innerHTML += `
<div class="video">
<h3>${v.title}</h3>
<a href="${v.url}" target="_blank">
<button>Watch</button>
</a>
</div>
`

})

}

showVideos(videos)

search.addEventListener("keyup",()=>{

const text = search.value.toLowerCase()

const filtered = videos.filter(v =>
v.title.toLowerCase().includes(text)
)

showVideos(filtered)

})
