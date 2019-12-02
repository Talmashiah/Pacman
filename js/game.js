'use strict';
var WALL = '🌴';
var FOOD = '🍌';
var SUPER_FOOD = '🍺';
var EMPTY = ' ';
var CHERRY = '🍒';

var gIntervalCherry;
var gFoodOnBoard = -1;
var gBoard;
var gEmptyCells = [];

var gGame = {
  score: 0,
  isOn: false
};

var elScore = document.querySelector('header h3 span');
var elGameOver = document.querySelector('.game-over');
var elVictorious = document.querySelector('.victorious');

function init() {
  gBoard = buildBoard();
  countFoodOnBoard(gBoard);
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  gGame.isOn = true;
  gIntervalCherry = setInterval(placeCherryAtRandomCell, 8000);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;

      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 2 && i < SIZE - 3) ||
        (j === 6 && i > 2 && i < SIZE - 3)) {

        board[i][j] = WALL;

      }
    }
  }
  board[1][1] = SUPER_FOOD;
  board[1][8] = SUPER_FOOD;
  board[8][1] = SUPER_FOOD;
  board[8][8] = SUPER_FOOD;
  return board;
}

function countFoodOnBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j] === FOOD) gFoodOnBoard++;
    }
  }
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  elScore.innerText = gGame.score;
}

function checkIfVictorious() {
  if (gFoodOnBoard === gSmallFoodEaten) {
    victorious();
  }
};

function victorious() {
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(placeCherryAtRandomCell);
  gIntervalGhosts = null;
  elVictorious.classList.remove('hidden');
}


function gameOver() {
  var audio = new Audio('sound/pacman_death.wav');
  audio.play();
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(placeCherryAtRandomCell);
  gIntervalGhosts = null;
  elGameOver.classList.remove('hidden');
}

function resetGame() {
  gGame.score = 0;
  gSmallFoodEaten = 0;
  gFoodOnBoard = -1;
  gEmptyCells = [];
  init();
  elScore.innerText = gGame.score;
  elGameOver.classList.add('hidden');
  elVictorious.classList.add('hidden');
}


function placeCherryAtRandomCell() {
  if (!gEmptyCells.length) return;
  var randomIndex = Math.floor(Math.random() * gEmptyCells.length);
  var currCell = gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j];
  while (currCell === PACMAN) {
    randomIndex = Math.floor(Math.random() * gEmptyCells.length);
    currCell = gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j];
  }
  gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j] = CHERRY;
  renderCell({ i: gEmptyCells[randomIndex].i, j: gEmptyCells[randomIndex].j }, CHERRY)
}


