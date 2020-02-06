const url = "ws://localhost:8080/Rchatt/chatserver";
const ws = new WebSocket(url);

function send(){
    ws.send(messageText.value);
    messageText.value = "";
}

ws.addEventListener("message", event =>{
    const data = JSON.parse(event.data);
    if(Array.isArray(data)){
        const output = data.map(d => d.username).join(`\n`);
        users.value = output;
    } else {
    textarea.value += `${data.from}: ${data.message}\n`;
}});

button.addEventListener('click', send);