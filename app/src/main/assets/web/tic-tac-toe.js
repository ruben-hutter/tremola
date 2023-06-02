document.addEventListener('DOMContentLoaded', () => {
    // Your code here
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
    let spaces = Array(9).fill(null);
    document.getElementById('send').addEventListener("click", function () {
        if (!spaces[id]) {
            spaces[id] = currentPlayer;
            id.innerText = currentPlayer;
            document.getElementById(id).style.pointerEvents = 'none'
            const winningCombo = playerHasWon();
            if (winningCombo !== false) {
                document.getElementById('playerText').style.display = null;
                document.getElementById('gameBoard').style.opacity = 0.5;

                playerText.innerHTML = `${currentPlayer} has won!`;
                boxes.forEach(box => {
                    box.style.pointerEvents = 'none';
                })
                let winning_blocks = winningCombo;

                winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
                return;
            }

            currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;

        }

    });
    const startGame = () => {
        boxes.forEach(box => box.addEventListener('click', boxClicked));
    }

    function boxClicked(e) {
        console.log(e.target.id)
        if (e.target.innerText == "" && targetBox != null && currentPlayer == previousPlayer) {
            targetBox.innerText="";

        }
        id = e.target.id;
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

    restartBtn.addEventListener('click', restart);

    //Should only be able to toggle if game is already ended, and not in midgame.
    function restart() {
        if (playerHasWon()) {
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

    startGame();
});