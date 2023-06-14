// tremola_toe.js

"use strict";

const X_TEXT = "X";
const O_TEXT = "O";
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

let playerText;
let boxes;
let gameState; //PROTOCOL: |0-8: boxes, 9: X_ID, 10: O_ID, 11: counter (X_ID has even and O_ID odd) & set to winner ID if finished|
let boxId;
let currentPlayer;
let previousBox;

function sendMove() {
    if (!gameState[boxId]) {
        gameState[boxId] = currentPlayer;
        //console.log("gameState: " + gameState);
        document.getElementById(boxId).innerText = currentPlayer;
        previousBox.style.pointerEvents = 'none';
        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            //TODO: Case distinction for winning gameState.
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = `${currentPlayer} has won!`;
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            remove_game_state();
            return;
        } /*else if (// draw state) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = 'Draw';
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
            return;
        }
        */

        gameState[11]++;
        new_post_gameState(gameState);
        load_chat(curr_chat);
    }
}

function boxClicked(id) {
    //TODO: check if previousPlayer needed and refactor
    let box = document.getElementById(id);
    if (box.innerText === "" && previousBox != null) {
        previousBox.innerText = "";
    }
    boxId = id;
    previousBox = box;
    box.innerText = currentPlayer;
}

function playerHasWon() {
    for (const condition of WINNING_COMBOS) {
        let [a, b, c] = condition;
        if (gameState[a] && (gameState[a] === gameState[b] && gameState[a] === gameState[c])) {
            gameState[11] = currentPlayer === X_TEXT ? gameState[9] : gameState[10];
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

    playerText = document.getElementById('playerText');
    boxes = Array.from(document.getElementsByClassName('box'));
    currentPlayer = X_TEXT;

    //TODO: check if previousPlayer necessary and refactor rest

    if (playerHasWon()) {

        boxes.forEach(box => {
            box.innerText = '';
            box.style.backgroundColor = '';
            box.style.pointerEvents = 'none';
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
    previousBox = null;
    playerText = document.getElementById('playerText');
    boxes = Array.from(document.getElementsByClassName('box'));

    for (let i = 0; i < 9; i++) {
        if (gameState[i] !== 0) {
            boxes[i].innerText = gameState[i];
            boxes[i].style.pointerEvents = 'none';
        }
    }
    //TODO: check if player allowed to play move or only watch gameState
}

//TODO: check draw state