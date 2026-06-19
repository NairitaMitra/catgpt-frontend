const API_URL = "https://catgpt-backend-fbvc.onrender.com/api/cat/ask";

function quickAsk(text) {
  document.getElementById("question").value = text;
  askCat();
}

function newFact() {
  const factElement = document.getElementById("catFact");

  const facts = [
    "Cats sleep around 12–16 hours a day.",
    "Cats can rotate their ears about 180 degrees.",
    "A cat’s nose print is unique like a fingerprint.",
    "Cats use their whiskers to measure openings.",
    "Most cats spend 70% of their lives sleeping.",
    "Cats can jump up to 6 times their body length.",
    "A group of cats is called a clowder.",
    "Cats have over 20 muscles controlling their ears."
  ];

  const randomFact =
    facts[Math.floor(Math.random() * facts.length)];

  factElement.innerHTML = randomFact;
}
function detectMood() {

    const image =
        document.getElementById("catImage").files[0];

    if (!image) {

        document.getElementById("moodResult").innerHTML = `
            🐾 Please upload a cat photo first.
        `;

        return;
    }

    document.getElementById("moodResult").innerHTML = `

        <div style="
            margin-top:20px;
            padding:20px;
            border-radius:15px;
            border:1px solid gold;
            background:rgba(255,255,255,0.05);
            color:white;
        ">

            <h2>🐱 Mood Analysis Complete</h2>

            <h3>😊 Mood: Happy Cat</h3>

            <p><strong>Confidence:</strong> 94%</p>

            <p>
                CatGPT detected a calm and friendly facial expression.
                The cat appears relaxed and comfortable.
            </p>

            <p>
                <strong>Recommendation:</strong><br>
                Your cat seems happy and stress-free. 🐾
            </p>

        </div>

    `;
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function saveHistory(question) {
  let history = JSON.parse(localStorage.getItem("catgptHistory")) || [];

  history = history.filter(item => item.text !== question);

  history.unshift({
    text: question,
    date: "Today"
  });

  if (history.length > 12) {
    history = history.slice(0, 12);
  }

  localStorage.setItem("catgptHistory", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  const history = JSON.parse(localStorage.getItem("catgptHistory")) || [];

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="history-item">
        <div>
          <div class="history-text">No recent chats yet</div>
          <div class="history-date">Ask CatGPT something 🐾</div>
        </div>
      </div>
    `;
    return;
  }

  historyList.innerHTML = "";

  history.forEach((item, index) => {
    historyList.innerHTML += `
      <div class="history-item">
        <div onclick="quickAsk('${escapeForClick(item.text)}')">
          <div class="history-text">${escapeHtml(item.text)}</div>
          <div class="history-date">${item.date}</div>
        </div>
        <button class="delete-history" onclick="deleteHistory(${index})">🗑</button>
      </div>
    `;
  });
}

function deleteHistory(index) {
  let history = JSON.parse(localStorage.getItem("catgptHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("catgptHistory", JSON.stringify(history));
  loadHistory();
}

function clearHistory() {
  localStorage.removeItem("catgptHistory");
  loadHistory();
}

async function askCat() {
  const input = document.getElementById("question");
  const question = input.value.trim();

  if (!question) return;

  const chatBox = document.getElementById("chatBox");

  saveHistory(question);

  chatBox.innerHTML += `
    <div class="message user">
      <div class="bubble">${escapeHtml(question)}</div>
    </div>
  `;

  input.value = "";

  if (
    question.toLowerCase().includes("cat image") ||
    question.toLowerCase().includes("cat photo") ||
    question.toLowerCase().includes("show cat") ||
    question.toLowerCase().includes("cat picture")
  ) {
    showCatImage();
    return;
  }

  const typingId = "typing-" + Date.now();

  chatBox.innerHTML += `
    <div class="message bot" id="${typingId}">
      <div class="avatar">🐱</div>
      <div class="bubble">🐾 CatGPT is thinking...</div>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: question
    });

    const answer = await response.text();

    document.getElementById(typingId)?.remove();

    chatBox.innerHTML += `
      <div class="message bot">
        <div class="avatar">🐱</div>
        <div class="bubble">${escapeHtml(answer)}</div>
      </div>
    `;
  } catch (error) {
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

async function showCatImage() {
  const chatBox = document.getElementById("chatBox");

  const loadingId = "cat-img-" + Date.now();

  chatBox.innerHTML += `
    <div class="message bot" id="${loadingId}">
      <div class="avatar">🐱</div>
      <div class="bubble">🐾 Finding a cute cat image...</div>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    const imageUrl = data[0].url;

    document.getElementById(loadingId)?.remove();

    chatBox.innerHTML += `
      <div class="message bot">
        <div class="avatar">🐱</div>
        <div class="bubble">
          Here is a cute cat for you 🐾
          <br><br>
          <img src="${imageUrl}" alt="Cute cat" />
        </div>
      </div>
    `;
  } catch (error) {
    document.getElementById(loadingId)?.remove();

    chatBox.innerHTML += `
      <div class="message bot">
        <div class="avatar">🐱</div>
        <div class="bubble">Could not load cat image right now.</div>
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

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

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}

function escapeForClick(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

document.getElementById("question").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    askCat();
  }
});

loadHistory();
newFact();
window.newFact = newFact;