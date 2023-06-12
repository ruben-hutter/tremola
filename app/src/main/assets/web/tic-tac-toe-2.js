
// Your code here
var gameState = [];
let playerText = document.getElementById('playerText');

let boxes;


//TODO fix the missing property
//let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');
let id;
let targetBox;
const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let previousPlayer = currentPlayer;
let spaces = Array(9).fill(null);
function send(){
    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        gameState[10] = 1;
        gameState[id] = 1;
        console.log("gameState: " + gameState);
        id.innerText = currentPlayer;
        document.getElementById(id).style.pointerEvents = 'none'
        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            //TODO: Case distinction for winning gameState.
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerText = currentPlayer +" has won!";
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            let winning_blocks = winningCombo;

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
            return;
        } else if (checkAllBoxes()) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `No one won`;
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })

            return;
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
        new_post_gameState(gameState); //Send the gameState as message to the other client
        //TODO: After send is clicked we need to change back to the correct chat automatically.
        load_chat(curr_chat);
    }

}
const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
    /*generates the gameState and sets all values to '0' -> '0000000000' first 9 numbers represent
     the boxes, last number indicates the current state.
     0 = No game running
     1 = its hosts turn
     2 = its the opponents turn
     3 = host won
     4 = opponent won
*/
    for(let i = 0; i<=9; i++){
        gameState[i] = 0;
    }
}

function boxClicked(e) {
    var e = document.getElementById(e);
    console.log(e)
    if (e.innerText == "" && targetBox != null && currentPlayer == previousPlayer) {
        targetBox.innerText="";

    }
    id = e.id;
    //gameState[id - 1] = 1; // should save the clicked box into the gameState.
    console.log(gameState);
    targetBox = e;
    e.innerText = currentPlayer;
    previousPlayer = currentPlayer;
    /*if (!spaces[id] && clicked) {
        spaces[id] = currentPlayer;

        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `${currentPlayer} has won!`;
            let winning_blocks = winningCombo;

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
            return;
            }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
        clicked = false;
    }*/
}

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a,b,c];
        }
    }
    return false;
}

//restartBtn.addEventListener('click', restart);

//Should only be able to toggle if game is already ended, and not in midgame.
function restart() {

    if (playerHasWon() || checkAllBoxes()) {
        spaces.fill(null);

        boxes.forEach(box => {
            box.innerText = '';
            box.style.backgroundColor = '';
            box.style.pointerEvents = null;
        })

        document.getElementById('playerText').style.display = 'none';
        document.getElementById('gameBoard').style.display = null;
        document.getElementById('gameBoard').style.opacity = 1;
        currentPlayer = X_TEXT;
    }
}
//TODO: Should load the current gameState of the game.
function LoadGame() {

}

function checkAllBoxes() {
    boxes = Array.from(document.getElementsByClassName('box'));
    let counter = 0;
    boxes.forEach(box => {

        if (box.innerText !== "") {
            counter++;
        }

    })
    console.log(counter)
    if (counter == 9) {
        return true;

    } else {
        return false;
    }
}

startGame();
