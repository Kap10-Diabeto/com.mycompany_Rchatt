const url = "ws://"+ location.host +"/com.mycompany_Rchatt/chatserver";
const ws = new WebSocket(url);
const cellElements = [...document.querySelectorAll('[data-cell')];
const board = document.getElementById('board');
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5], 
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const X_CLASS = 'x';
const O_CLASS = 'o';
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton')
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame)

function startGame(){
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.removeEventListener('click', handleClick, {once:true})
        cell.addEventListener('click', handleClick, {once: true})
    })
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');

}

function handleClick(e){
  const cell = e.target;
  const currentClass = circleTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
}

function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = 'Draw!';
    } else{
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function isDraw(){
    return cellElements.every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
    const index = cellElements.indexOf(cell); 
    let data = {index, currentClass};
    const jsonData = JSON.stringify(data);
    ws.send(jsonData);
}


function swapTurns(){
    circleTurn = !circleTurn;
}

function setBoardHoverClass(){
board.classList.remove(X_CLASS);
board.classList.remove(O_CLASS);
if(circleTurn){
    board.classList.add(O_CLASS)
} else{
    board.classList.add(X_CLASS)
}
}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination =>{
        return combination.every(index =>{
            return cellElements[index].classList.contains(currentClass);
        })
    })
}


function send(){
    ws.send(messageText.value);
    messageText.value = "";
}

ws.addEventListener("message", event =>{
    const data = JSON.parse(event.data);

    if(Array.isArray(data)){
        const output = data.map(d => d.username).join(`\n`);
       // users.value = output;
    } else {
        try{
        const unpackJson = JSON.parse(data.message);
        cellElements[unpackJson.index].classList.add(unpackJson.currentClass);
        const currentClass = circleTurn ? O_CLASS : X_CLASS;
        if (checkWin(currentClass)){
            endGame(false)
          } else if (isDraw()) {
              endGame(true)
          } else{
            swapTurns();
            setBoardHoverClass();
          }
        }catch{
            
        }
       
        //Hitta domelement från index och sätta class
    textarea.value += `${data.from}: ${data.message}\n`;
}});

button.addEventListener('click', send);