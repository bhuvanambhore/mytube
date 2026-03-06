async function addVideo(){

let url=document.getElementById("videoLink").value
let category=document.getElementById("videoCategory").value

let id=url.split("v=")[1]?.split("&")[0]

let video={
title:"YouTube Video",
url:url,
category:category,
thumb:`https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

videos.unshift(video)

const token="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"

await fetch("https://api.github.com/repos/bhuvanambhore/mytube/contents/videos.json",{
method:"PUT",
headers:{
"Authorization":"token "+token,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Add new video",
content:btoa(JSON.stringify(videos,null,2))
})
})

}
