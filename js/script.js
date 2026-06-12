const API_URL =
"https://catgpt-backend-fbvc.onrender.com/api/cat/ask";

function setCategory(text){

document.getElementById("question").value=text;

}

async function askCat(){

const input =
document.getElementById("question");

const question =
input.value.trim();

if(question==="") return;

const chatBox =
document.getElementById("chat-box");

chatBox.innerHTML +=
`<div class="user-message">${question}</div>`;

input.value="";

chatBox.innerHTML +=
`<div class="bot-message" id="typing">
🐱 CatGPT is thinking...
</div>`;

chatBox.scrollTop =
chatBox.scrollHeight;

try{

const response =
await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"text/plain"
},
body:question
});

const answer =
await response.text();

document.getElementById("typing").remove();

chatBox.innerHTML +=
`<div class="bot-message">${answer}</div>`;

chatBox.scrollTop =
chatBox.scrollHeight;

}
catch(error){

document.getElementById("typing").remove();

chatBox.innerHTML +=
`<div class="bot-message">
⚠ Unable to connect to CatGPT server.
</div>`;

}

}

document
.getElementById("question")
.addEventListener("keypress",function(e){

if(e.key==="Enter"){
askCat();
}

});