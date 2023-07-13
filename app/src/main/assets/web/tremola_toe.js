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
    if (boxId != null && !gameState[boxId]) {
        gameState[boxId] = currentPlayer;
        targetBox.innerText = currentPlayer;
        targetBox.style.pointerEvents = 'none';

        // check if player already won
        const winningCombo = playerHasWon();
        const winner = getWinner();
        if (winningCombo !== false) {
            gameState[11] = currentPlayer === X_TEXT ? gameState[9] : gameState[10];
            displayGameFinished(gameState[11]);
        } else if (winner === -1) {
            displayGameFinished(winner);
        }

        if (typeof gameState[11] == "number") {
            gameState[11]++;
        }
        new_post_gameState(GAMES[0], gameState);
        if (winningCombo === false && winner !== -1) {
            load_chat(curr_chat);
        }
        if (typeof winner != "number" || winner === -1) {
            remove_game_state();
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

function displayGameFinished(winner) {
    document.getElementById('playerText').style.display = null;
    document.getElementById('gameBoard').style.opacity = 0.5;
    playerText.innerHTML = winner !== -1 ? `${getWinnerText(winner)} has won!` : "Draw";
    boxes.forEach(box => {
        box.style.pointerEvents = 'none';
    });
}

function getCurrentPlayer() {
    if (typeof gameState[11] != "number") {
        currentPlayer = gameState[11] === gameState[9] ? O_TEXT : X_TEXT;
        return;
    }
    currentPlayer = gameState[11] % 2 === 0 ? X_TEXT : O_TEXT;
}

function getWinnerText(playerId) {
    return playerId === gameState[9] ? X_TEXT : O_TEXT;
}

function startTremolaToe(myId, opponentId) {
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
        } else {
            boxes[i].innerText = "";
            boxes[i].style.pointerEvents = null;
        }
    }

    if (isGameFinished()) { // check if game finished
        displayGameFinished(getWinner());
        remove_game_state();
    } else if (!isPlayersTurn()) { // check if allowed to make a move
        boxes.forEach(box => {
            box.style.pointerEvents = 'none';
        });

    } else if (isPlayersTurn()) {
        document.getElementById('playerText').style.display = 'none';
        document.getElementById('gameBoard').style.display = null;
        document.getElementById('gameBoard').style.opacity = 1;
    }
}

function isGameFinished() {
    return typeof gameState[11] != "number" || gameState[11] > 8;
}

function loadHTML() {
    playerText = document.getElementById('playerText');
    boxes = Array.from(document.getElementsByClassName('box'));
}

function isPlayersTurn() {
    if (typeof gameState[11] != "number") {
        return false;
    }
    if (gameState[11] % 2 === 0 && myId === gameState[9]) {
        return true;
    } else if (gameState[11] % 2 === 1 && myId === gameState[10]) {
        return true;
    }
}

function getWinner() {
    if (typeof gameState[11] == "number" && gameState[11] >= 8) {
        // Draw
        return -1;
    }
    return gameState[11];
}
