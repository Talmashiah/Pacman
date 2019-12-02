var GHOST = '👻';
var gGhostsColors = [];
var gIntervalGhosts;
var gGhosts;
var gCountDeadGhosts = 0;

function createGhost(board) {
    var ghost = {
        location: {
            i: 5,
            j: 4
        },
        currCellContent: FOOD,
        color: getRandomColor()
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    gGhosts = [];

    // empty the gGhosts array, create some ghosts
    createGhost(board)
    createGhost(board)
    createGhost(board)
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 400)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation = { i: ghost.location.i + moveDiff.i, j: ghost.location.j + moveDiff.j }
        // console.log('ghost.location', ghost.location, 'nextLocation', nextLocation, 'moveDiff', moveDiff)

        // if WALL return
        if (gBoard[nextLocation.i][nextLocation.j] === WALL) return

        if (gBoard[nextLocation.i][nextLocation.j] === PACMAN && gPacman.isSuper) {
            return;
        }
        // if PACMAN - gameOver, return
        if (gBoard[nextLocation.i][nextLocation.j] === PACMAN) {
            gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
            renderCell(ghost.location, ghost.currCellContent)
            ghost.location = nextLocation
            ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]
            gBoard[ghost.location.i][ghost.location.j] = GHOST
            renderCell(ghost.location, getGhostHTML(ghost))
            gameOver()
            return;
        }
        
        if (gBoard[nextLocation.i][nextLocation.j] === GHOST) {
            return;
        }

        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)
        ghost.location = nextLocation
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))

    }
}
function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost) {
    return `<span style="background-color:${ghost.color};">${GHOST}</span>`;
}

function removeGhostFromArr(ghostLocation) {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghosts = gGhosts[i];
        if (ghosts.location.i === ghostLocation.i && ghosts.location.j === ghostLocation.j) {
            gCountDeadGhosts++;
            if(ghosts.currCellContent === FOOD){ 
            gSmallFoodEaten++;
            gGhosts.splice(i, 1);
            }
        }
    }
}

function returnGhostsToLife(numOfDeadGhosts) {
    for (var i = 0; i < numOfDeadGhosts; i++) {
        createGhost(gBoard);
    }
}




