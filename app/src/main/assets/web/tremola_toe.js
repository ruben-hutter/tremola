// tremola_toe.js

"use strict";

let playerText = document.getElementById('playerText');
let boxes = Array.from(document.getElementsByClassName('box'));

const O_TEXT = "O";
const X_TEXT = "X";
const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let gameState; // PROTOCOL: |0-8: boxes, 9: X_ID, 10: O_ID, 11: counter (X_ID has even and O_ID odd) & set to winner ID if finished|
let boxId;
let targetBox;
let currentPlayer;
let previousPlayer;

function sendMove() {
    if (!gameState[boxId]) {
        gameState[boxId] = currentPlayer;
        //console.log("gameState: " + gameState);
        targetBox.innerText = currentPlayer;
        document.getElementById(boxId).style.pointerEvents = 'none'
        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            //TODO: Case distinction for winning gameState.
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `${currentPlayer} has won!`;
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            return;
        } else if (checkAllBoxes()) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = 'Draw';
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            return;
        }

        currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        new_post_gameState(gameState); //Send the gameState as message to the other client
        //TODO: After send is clicked we need to change back to the correct chat automatically.
        load_chat(curr_chat);
    }
}

function boxClicked(id) {
    let box = document.getElementById(id);
    if (box.innerText === "" && targetBox != null && currentPlayer === previousPlayer) {
        targetBox.innerText = "";
    }
    boxId = id;
    targetBox = box;
    box.innerText = currentPlayer;
    previousPlayer = currentPlayer;
}

function playerHasWon() {
    for (const condition of WINNING_COMBOS) {
        let [a, b, c] = condition;

        if (gameState[a] && (gameState[a] === gameState[b] && gameState[a] === gameState[c])) {
            return [a, b, c];
        }
    }
    return false;
}

function getCurrentPlayer() {
    if (typeof gameState[11] === "number" && gameState[11] % 2 === 0) {
        currentPlayer = X_TEXT;
        return;
    }
    currentPlayer = O_TEXT;
}

function startTremolaToe(myId, opponentId) {
    gameState = new Array(12).fill(0);
    gameState[9] = myId;
    gameState[10] = opponentId;

    currentPlayer = X_TEXT;
    //previousPlayer = currentPlayer;

    if (playerHasWon() || checkAllBoxes()) {

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

function loadTremolaToe(newGameState) {
    gameState = newGameState;
    getCurrentPlayer();
}

function checkAllBoxes() {
    boxes = Array.from(document.getElementsByClassName('box'));
    let counter = 0;
    boxes.forEach(box => {

        if (box.innerText !== "") {
            counter++;
        }

    })
    return counter === 9;
}
