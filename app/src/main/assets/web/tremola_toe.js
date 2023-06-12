let gameState = new Array(13).fill(0);
let playerText = document.getElementById('playerText');
let boxes = Array.from(document.getElementsByClassName('box'));

//TODO fix the missing property
//let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');
let id;
let targetBox;
const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let previousPlayer = currentPlayer;
let spaces = Array(9).fill(null);

function send() {
    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        gameState[id] = currentPlayer;
        //console.log("gameState: " + gameState);
        id.innerText = currentPlayer;
        document.getElementById(id).style.pointerEvents = 'none'
        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            //TODO: Case distinction for winning gameState.
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `${currentPlayer} has won!`;
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            let winning_blocks = winningCombo;

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
            return;
        } else if (checkAllBoxes()) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `No one one`;
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

function boxClicked(e) {
    var e = document.getElementById(e);
    //console.log(e)
    if (e.innerText == "" && targetBox != null && currentPlayer == previousPlayer) {
        targetBox.innerText = "";

    }
    id = e.id;
    //gameState[id - 1] = 1; // should save the clicked box into the gameState.
    //console.log(gameState);
    targetBox = e;
    e.innerText = currentPlayer;
    previousPlayer = currentPlayer;
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
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

function checkAllBoxes() {
    boxes = Array.from(document.getElementsByClassName('box'));
    let counter = 0;
    boxes.forEach(box => {

        if (box.innerText !== "") {
            counter++;
        }

    })
    //console.log(counter)
    if (counter == 9) {
        return true;

    } else {
        return false;
    }
}
