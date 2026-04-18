let BOARD_SIZE; // размер доски задаёт пользователь

let currentPlayer = 'X';
let gameBoard = [];
let gameActive = true;

const boardElement = document.getElementById('tic-tac-toe-board');
const messageElement = document.getElementById('gameMessage');
const resetButton = document.getElementById('resetButton');
let cells = [];

// спрашиваем размер у пользователя
function askBoardSize() {
  let sizeStr = prompt('Введите размер поля (от 3 до 10):', '3');
  if (sizeStr === null) {
    // если отменил — ставим по умолчанию 3
    return 3;
  }
  let size = parseInt(sizeStr, 10);
  if (Number.isNaN(size) || size < 3 || size > 10) {
    alert('Нужно число от 3 до 10. Будет использован размер 3.');
    return 3;
  }
  return size;
}

function initGameBoardArray() {
  gameBoard = new Array(BOARD_SIZE * BOARD_SIZE).fill('');
}

//Отвечает за создание поля на странице, очищает, создает новое кол-во//
function renderBoard() {
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 80px)`;
  boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 80px)`;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = `cell-${i}`;
    cell.addEventListener('click', cellClicked, false);
    fragment.appendChild(cell);
  }

  boardElement.appendChild(fragment);
  cells = document.querySelectorAll('.cell');
}


function handlePlayerTurn(index) {
  if (gameBoard[index] !== '' || !gameActive) return;
  gameBoard[index] = currentPlayer;
}

function updateUI() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = gameBoard[i];
  }
}
//обработчик клика по клетке//
function cellClicked(event) {
  const clickedCell = event.target;
  const index = parseInt(clickedCell.id.replace('cell-', ''), 10);

  if (gameBoard[index] !== '' || !gameActive) return;

  const playerThatMadeMove = currentPlayer;

  handlePlayerTurn(index);
  updateUI();

  if (checkForWin(playerThatMadeMove)) {
    announceWinner(playerThatMadeMove);
    gameActive = false;
    return;
  }

  if (checkForDraw()) {
    announceDraw();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// проверка победы для n x n
function checkForWin(player) {
  const n = BOARD_SIZE;
  // строки
  for (let row = 0; row < n; row++) {
    let win = true;
    for (let col = 0; col < n; col++) {
      if (gameBoard[row * n + col] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }
  // столбцы
  for (let col = 0; col < n; col++) {
    let win = true;
    for (let row = 0; row < n; row++) {
      if (gameBoard[row * n + col] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }
  // главная диагональ
  let winMainDiag = true;
  for (let i = 0; i < n; i++) {
    if (gameBoard[i * n + i] !== player) {
      winMainDiag = false;
      break;
    }
  }
  if (winMainDiag) return true;
  // побочная диагональ
  let winAntiDiag = true;
  for (let i = 0; i < n; i++) {
    if (gameBoard[i * n + (n - 1 - i)] !== player) {
      winAntiDiag = false;
      break;
    }
  }
  if (winAntiDiag) return true;

  return false;
}
function checkForDraw() {
  return !gameBoard.includes('');
}

function announceWinner(player) {
  messageElement.innerText = `Победил ${player}! Возьми с полки пирожок`;
}

function announceDraw() {
  messageElement.innerText = 'Ничья, победила дружба!';
}

function resetGame() {
  // при сбросе тоже спрашиваем размер заново
  BOARD_SIZE = askBoardSize();
  gameActive = true;
  currentPlayer = 'X';
  initGameBoardArray();
  renderBoard();
  updateUI();
  messageElement.innerText = '';
}

function init() {
  BOARD_SIZE = askBoardSize();
  gameActive = true;
  currentPlayer = 'X';
  initGameBoardArray();
  renderBoard();
  updateUI();
}

resetButton.addEventListener('click', resetGame, false);
init();
