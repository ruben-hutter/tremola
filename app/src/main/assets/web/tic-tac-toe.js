document.addEventListener('DOMContentLoaded', () => {
    // Your code here
    let gameState;
    let opponentId = tremola.chats[curr_chat]["members"][1];
    let playerText = document.getElementById('playerText');
    let restartBtn = document.getElementById('restartBtn');
    let boxes = Array.from(document.getElementsByClassName('box'));


    //TODO fix the missing property
    let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');
    let id;
    let targetBox;
    const O_TEXT = "O";
    const X_TEXT = "X";
    let currentPlayer = X_TEXT;
    let previousPlayer = currentPlayer;
    let spaces = new Array(9).fill(null);
    document.getElementById('send').addEventListener("click", function () {
        if (!spaces[id]) {
            spaces[id] = currentPlayer;
            //TODO why gameState[10] set to 1?
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

                playerText.innerHTML = `${currentPlayer} has won!`;
                let winning_blocks = winningCombo;

                winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
                return;
            }

            currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
            tremola.games["tremola_toe"][opponentId] = gameState; // update gameState locally
            new_post_gameState(gameState); // send the gameState as message to the other client
            //TODO: After send is clicked we need to change back to the correct chat automatically.
            load_chat(curr_chat);
        }
    });

    const startGame = () => {
        boxes.forEach(box => box.addEventListener('click', boxClicked));
        /*
        generates the gameState and sets all values to '0' -> '0000000000' first 9 numbers represent
         the boxes, last number indicates the current state.
         0 = No game running
         1 = its hosts turn
         2 = its the opponents turn
         3 = host won
         4 = opponent won
        */
        gameState = new Array(10).fill(0);
        tremola.games["tremola_toe"] = gameState;
    }

    function boxClicked(e) {
        console.log("boxClicked: " + e.target.id)
        if (e.target.innerText == "" && targetBox != null && currentPlayer == previousPlayer) {
            targetBox.innerText="";

        }
        id = e.target.id;
        //gameState[id - 1] = 1; // should save the clicked box into the gameState.
        console.log("boxClicked: " + gameState);
        targetBox = e.target;
        e.target.innerText = currentPlayer;
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

    const WINNING_COMBOS = [
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
        for (const condition of WINNING_COMBOS) {
            let [a, b, c] = condition;

            if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
                return [a,b,c];
            }
        }
        return false;
    }

    restartBtn.addEventListener('click', restart);

    //TODO Should only be able to toggle if game is already ended, and not in mid-game.
    function restart() {
        spaces.fill(null);

        boxes.forEach( box => {
            box.innerText = '';
            box.style.backgroundColor='';
            box.style.pointerEvents = null;
        })

        document.getElementById('playerText').style.display = 'none';
        document.getElementById('gameBoard').style.display = null;
        document.getElementById('gameBoard').style.opacity = 1;
        currentPlayer = X_TEXT;
    }

    function loadGame() {
        let games = tremola.games["tremola_toe"]; // tremola_toe: {"id": gameState, ...}

        var n = recps2nm([myId]);
        tremola.chats[n] = {
            "alias": "local notes (for my eyes only)", "posts": {}, "forgotten": false,
            "members": [myId], "touched": Date.now(), "lastRead": 0
        };
    }

    startGame();
});