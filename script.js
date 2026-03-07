const repo="bhuvanambhore/mytube"
const container=document.getElementById("videoGrid")

async function loadVideos(){

const res=await fetch(`https://api.github.com/repos/${repo}/issues`)
const issues=await res.json()

container.innerHTML=""

issues.forEach(issue=>{

const url=issue.body.match(/https?:\/\/[^\s]+/)

if(!url) return

const video=url[0]
const id=video.split("v=")[1]

const thumb=`https://img.youtube.com/vi/${id}/hqdefault.jpg`

container.innerHTML+=`

<div class="videoCard" onclick="playVideo('${video}')">

<img src="${thumb}">

<div class="videoTitle">
${issue.title}
</div>

</div>

`

})

}

loadVideos()
