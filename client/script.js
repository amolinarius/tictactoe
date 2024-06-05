import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io();
const cells = document.querySelectorAll('table tr td');
var symbol = null; // "x"||"o"||null
var isTurn = false;
var initialBoard = null;

socket.on('symbol', sym => {
    if (sym == null) {
        alert('You can\'t play because there are already two players in the room.');
    }
    else {
        alert(sym);
        symbol = sym;
        if (sym == "X") {isTurn = true}
    }
});
socket.on('board', board=>{
    console.log(board);
    initialBoard = board;
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = initialBoard[i] || "";
    }
});

/**
 * @param {MouseEvent} e
 */
const onCellClick = e => {
    console.log(initialBoard,isTurn,symbol);
    if (
        e.target.textContent == "X" || e.target.textContent == "O" ||
        (symbol != "X" && symbol != "O") ||
        !isTurn || initialBoard == null
    ) { return }
    console.log(initialBoard,isTurn,symbol);
    socket.emit('click', [...cells].indexOf(e.target));
}

const hasWon = () => {
    const cellValues = [...cells].map(c=>c.textContent);
    if (
        // Rows
        (cellValues[0] != "" && cellValues[0] == cellValues[1] && cellValues[1] == cellValues[2]) ||
        (cellValues[3] != "" && cellValues[3] == cellValues[4] && cellValues[4] == cellValues[5]) ||
        (cellValues[6] != "" && cellValues[6] == cellValues[7] && cellValues[7] == cellValues[8]) ||

        // Columns
        (cellValues[0] != "" && cellValues[0] == cellValues[3] && cellValues[3] == cellValues[6]) ||
        (cellValues[1] != "" && cellValues[1] == cellValues[4] && cellValues[4] == cellValues[7]) ||
        (cellValues[2] != "" && cellValues[2] == cellValues[5] && cellValues[5] == cellValues[8]) ||

        // Diagonals
        (cellValues[0] != "" && cellValues[0] == cellValues[4] && cellValues[4] == cellValues[8]) ||
        (cellValues[2] != "" && cellValues[2] == cellValues[4] && cellValues[4] == cellValues[6])

        //? |-----|
        //? |0|1|2|
        //? |3|4|5|
        //? |6|7|8|
        //? |-----|

    )
    { return cellValues[0] == symbol; }
    //? True if player won, false if he lost, null if he has in nor won neither lost
    return null;
}

cells.forEach(cell=>cell.addEventListener('click', onCellClick));
socket.on('click', (sym, cell) => {
    cells[cell].textContent = sym;
    isTurn = !isTurn;
    const winState = hasWon();
    if (winState == true) {
        alert('You won!');
    }
    else if (winState == false) {
        alert('You lost!');
    }
});