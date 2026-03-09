const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('game-status');
const resetButton = document.getElementById('reset');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  for (const [a,b,c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) return 'draw';
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (gameOver || board[index] !== null || currentPlayer !== 'X') return;

  board[index] = 'X';
  e.target.textContent = 'X';

  const result = checkWinner();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = 'O';
    statusDiv.textContent = 'Computer ist dran...';
    setTimeout(computerMove, 500);
  }
}
function findBestMove(player) {
  for (const [a, b, c] of winningCombos) {
    const line = [board[a], board[b], board[c]];
    // Wenn 2 Felder vom gleichen Spieler belegt sind und 1 frei ist → guter Zug
    if (line.filter(v => v === player).length === 2 && line.includes(null)) {
      return [a, b, c][line.indexOf(null)];
    }
  }
  return null;
}

function computerMove() {
  if (gameOver) return;

  let move = null;

  // 1. Computer versucht zu gewinnen
  move = findBestMove('O');

  // 2. Wenn das nicht geht: Spieler blockieren
  if (move === null) {
    move = findBestMove('X');
  }

  // 3. Wenn auch das nicht geht: zufälliger Zug
  if (move === null) {
    const emptyIndices = board
      .map((val, idx) => val === null ? idx : null)
      .filter(idx => idx !== null);

    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Zug ausführen
  board[move] = 'O';
  cells[move].textContent = 'O';

  const result = checkWinner();
  if (result) {
    endGame(result);
  } else {
    currentPlayer = 'X';
    statusDiv.textContent = 'Du bist dran (X).';
  }
}


function endGame(result) {
  gameOver = true;
  if (result === 'draw') {
    statusDiv.textContent = 'Unentschieden!';
  } else if (result === 'X') {
    statusDiv.textContent = 'Du hast gewonnen! 🎉';
  } else {
    statusDiv.textContent = 'Der Computer hat gewonnen.';
  }
}

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';
  statusDiv.textContent = 'Du bist X. Viel Erfolg!';
  cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
