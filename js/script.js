const BACKEND_URL =
"https://catgpt-backend-fbvc.onrender.com/api/cat/ask";

async function askCat(){

    const input =
    document.getElementById("question");

    const question =
    input.value;

    if(question.trim()===""){
        return;
    }

    const chat =
    document.getElementById("chatBox");

    chat.innerHTML +=
    `<div class="user-message">${question}</div>`;

    input.value="";

    try{

        const response =
        await fetch(BACKEND_URL,{
            method:"POST",
            headers:{
                "Content-Type":"text/plain"
            },
            body:question
        });

        const answer =
        await response.text();

        chat.innerHTML +=
        `<div class="bot-message">${answer}</div>`;

    }
    catch(error){

        chat.innerHTML +=
        `<div class="bot-message">
        Server unavailable.
        </div>`;
    }

    chat.scrollTop =
    chat.scrollHeight;
}