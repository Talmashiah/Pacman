var gPacman;
var gSmallFoodEaten = 0;
const PACMAN = '🐵';

function createPacman(board) {
  gPacman = {
    location: {
      i: 5,
      j: 8
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);

  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  if (nextCell === WALL) return;

  if (nextCell === CHERRY) {
    updateScore(100)
    var audio = new Audio('sound/pacman_eatfruit.wav');
    audio.play();
  };

  if (nextCell === FOOD) {
    var audio = new Audio('sound/pacman_chomp.wav');
    updateScore(5);
    gSmallFoodEaten++;
    gEmptyCells.push(nextLocation);
    if(gSmallFoodEaten % 3 === 0)audio.play();
  }
  else if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
    updateScore(25);
    turnToSuperPacman();
    setTimeout(revertFromSuperPacman, 5000);
  }
  else if (nextCell === SUPER_FOOD && gPacman.isSuper) {
    return;
  }
  else if (nextCell === GHOST && !gPacman.isSuper) {
    gameOver()
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);
    return;
  }
  else if (nextCell === GHOST && gPacman.isSuper) {
    var audio = new Audio('sound/pacman_eatghost.wav');
    audio.play();
    removeGhostFromArr(nextLocation);
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  renderCell(gPacman.location, EMPTY);
  gPacman.location = nextLocation;
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  renderCell(gPacman.location, PACMAN);

  checkIfVictorious();
}

function turnToSuperPacman() {
  var audio = new Audio('sound/pacman_intermission.wav');
  audio.play();
  gGhostsColors = [];
  gPacman.isSuper = true;
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    gGhostsColors.push(ghost.color);
    ghost.color = 'blue';
  }
}

function revertFromSuperPacman() {
  gPacman.isSuper = false;
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    ghost.color = gGhostsColors[i];
  }
  returnGhostsToLife(gCountDeadGhosts);
  gCountDeadGhosts = 0;
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default: return null;
  }

  return nextLocation;
}