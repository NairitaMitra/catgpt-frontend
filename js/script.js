const API_URL = "https://catgpt-backend-fbvc.onrender.com/api/cat/ask";

const facts = [
  "Cats sleep around 12–16 hours a day.",
  "Cats can rotate their ears about 180 degrees.",
  "A cat’s nose print is unique, like a fingerprint.",
  "Cats use their whiskers to sense space and movement.",
  "Purring can mean comfort, but sometimes also stress.",
  "Kittens need extra protein and frequent meals."
];

function newFact(){
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("catFact").innerText = fact;
}

function quickAsk(text){
  document.getElementById("question").value = text;
  askCat();
}

async function askCat(){
  const input = document.getElementById("question");
  const question = input.value.trim();
  if(!question) return;

  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `
    <div class="message user">
      <div class="bubble">${escapeHtml(question)}</div>
    </div>
  `;

  input.value = "";

  const typingId = "typing-" + Date.now();

  chatBox.innerHTML += `
    <div class="message bot" id="${typingId}">
      <div class="avatar">🐱</div>
      <div class="bubble typing">🐾 CatGPT is thinking <span>...</span></div>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  try{
    const response = await fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"text/plain"},
      body:question
    });

    const answer = await response.text();

    document.getElementById(typingId)?.remove();

    chatBox.innerHTML += `
      <div class="message bot">
        <div class="avatar">🐱</div>
        <div class="bubble">${escapeHtml(answer)}</div>
      </div>
    `;
  }
  catch(error){
    document.getElementById(typingId)?.remove();

    chatBox.innerHTML += `
      <div class="message bot">
        <div class="avatar">🐱</div>
        <div class="bubble">⚠ CatGPT server is waking up. Please try again in a few seconds.</div>
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g,function(m){
    return {
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[m];
  });
}

document.getElementById("question").addEventListener("keydown",function(e){
  if(e.key === "Enter"){
    askCat();
  }
});

newFact();
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const micButton = document.querySelector(".mic-btn");
  const input = document.getElementById("question");

  if (!SpeechRecognition) {
    input.placeholder = "Voice not supported. Please type your question.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micButton.classList.add("listening");
  micButton.innerText = "🎙️";
  input.placeholder = "Listening... speak now";

  try {
    recognition.start();
  } catch (e) {
    micButton.classList.remove("listening");
    micButton.innerText = "🎤";
    input.placeholder = "Please type your question...";
    return;
  }

  recognition.onresult = function(event) {
    const voiceText = event.results[0][0].transcript;
    input.value = voiceText;
    input.placeholder = "Ask CatGPT about cats...";
  };

  recognition.onerror = function(event) {
    console.log("Voice error:", event.error);
    input.placeholder = "Voice failed. Please type your question.";
  };

  recognition.onend = function() {
    micButton.classList.remove("listening");
    micButton.innerText = "🎤";
    if (!input.value) {
      input.placeholder = "Voice failed. Please type your question.";
    }
  };
}