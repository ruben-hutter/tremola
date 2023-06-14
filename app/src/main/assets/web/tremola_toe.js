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
let targetBox;

function sendMove() {
    if (!gameState[boxId]) {
        gameState[boxId] = currentPlayer;
        //console.log("gameState: " + gameState);
        document.getElementById(boxId).innerText = currentPlayer;
        targetBox.style.pointerEvents = 'none';
        const winningCombo = playerHasWon();
        if (winningCombo !== false) {
            gameState[11] = currentPlayer === X_TEXT ? gameState[9] : gameState[10];
            displayWinner();
        } /*else if (// draw state) {
            document.getElementById('playerText').style.display = null;
            document.getElementById('gameBoard').style.opacity = 0.5;

            playerText.innerHTML = 'Draw';
            boxes.forEach(box => {
                box.style.pointerEvents = 'none';
            })
        }
        */

        gameState[11]++;
        new_post_gameState(gameState);
        if (winningCombo === false) {
            load_chat(curr_chat);
        }
    }
}

function boxClicked(id) {
    boxId = id;
    let newTargetBox = document.getElementById(id);
    // reset old targetBox to empty
    if (newTargetBox.innerText === "" && targetBox != null) {
        targetBox.innerText = "";
    }
    // set newTargetBox
    targetBox = newTargetBox;
    targetBox.innerText = currentPlayer;
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

function displayWinner() {
    document.getElementById('playerText').style.display = null;
    document.getElementById('gameBoard').style.opacity = 0.5;

    playerText.innerHTML = `${currentPlayer} has won!`;
    boxes.forEach(box => {
        box.style.pointerEvents = 'none';
    });
    remove_game_state();
}

function getCurrentPlayer() {
    if (typeof gameState[11] != "number") {
        currentPlayer = gameState[11] === gameState[9] ? O_TEXT : X_TEXT;
        return;
    }
    currentPlayer = gameState[11] % 2 === 0 ? X_TEXT : O_TEXT;
}

function startTremolaToe(opponentId) {
    gameState = new Array(12).fill(0);
    gameState[9] = myId;
    gameState[10] = opponentId;
    currentPlayer = X_TEXT;
    loadHTML();

    boxes.forEach(box => {
        box.innerText = '';
        box.style.pointerEvents = null;
    })
    document.getElementById('playerText').style.display = 'none';
    document.getElementById('gameBoard').style.display = null;
    document.getElementById('gameBoard').style.opacity = 1;
}

function loadTremolaToe(newGameState) {
    // load gameState
    gameState = newGameState;
    targetBox = null;
    getCurrentPlayer();
    loadHTML();

    for (let i = 0; i < 9; i++) {
        if (gameState[i] !== 0) {
            boxes[i].innerText = gameState[i];
            boxes[i].style.pointerEvents = 'none';
        }
    }

    //TODO: test when protocol implemented
    if (playerHasWon()) { // check if game finished
        displayWinner();
    } else if (!isPlayersTurn()) { // check if allowed to make a move
        boxes.forEach(box => {
            box.style.pointerEvents = 'none';
        });
        //TODO: block send button?
    }
}

function loadHTML() {
    playerText = document.getElementById('playerText');
    boxes = Array.from(document.getElementsByClassName('box'));
}

function isPlayersTurn() {
    if (typeof gameState[11] != "number") {
        return false;
    }
    if (gameState[11] % 2 === 0) {
        return myId === gameState[9];
    }
}

//TODO: check draw state