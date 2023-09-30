const MAX_COLS = 30;
const MAX_ROWS = 30;
const DEFAULT_SETTING = 1;
const DIFFICULTY_LEVELS = [50, 80, 140];
const CLEARED_CLASS = "cleared";
const DEFAULT_CSS = "cell";

class Game {
  constructor() {
    this.columns = MAX_COLS;
    this.rows = MAX_ROWS;
    this.started = false;
    this.difficultySetting = DEFAULT_SETTING;
    this.difficulty = DIFFICULTY_LEVELS;
    this.clearedCClass = CLEARED_CLASS;
    this.defaultCSS = DEFAULT_CSS;
    this.score = 0;
    this.bombLocations = [];
    this.directions = [[-1, 0], [-1, -1], [0, -1], [+1, -1], [+1, 0], [+1, +1], [0, +1], [-1, +1]]; // For directional checks
  }
}

class Cell {
  constructor(element) {
    this.bomb = false;
    this.cleared = false;
    this.nearby = 0;
    this.element = element;
    element.classList.remove(...element.classList); // Remove any addded css styling
    element.classList.add(game.defaultCSS); // Readds the default styling
    element.innerHTML = ""; // Resets inner HTML to empty.
  }
}

class Grid {
  constructor() {
    this.cell = [];
    this.generateGrid();
  }

  // Creates a new grid with default values and styling
  generateGrid() {
    for (let y = 0; y < game.rows; y++) {
      for (let x = 0; x < game.columns; x++) {
        if(y === 0) {
          this.cell.push([]); // Initializes the columns. While y is 0, we are iterating through the columns for the first time, so we need to create them.
       }
       const element = document.querySelector(`[data-x="${x}"][data-y="${y}"]`); // Grab the respective DOM element
       this.cell[x][y] = new Cell(element); // Create a new cell in this index and send the respective DOM element as a parameter so it can hold it as a reference
      }
    }
  }

  revealBombs() {
    for(const coordinates of game.bombLocations) {
      const x = coordinates[0];
      const y = coordinates[1];
      this.cell[x][y].element.classList.add("bombreveal");
    }
  }

  clearCell(x, y) {
    const cell = this.cell[x][y];
    const element = document.getElementById("scount");
    game.score += 1;
    element.innerHTML = game.score;
    cell.cleared = true;
    cell.element.classList.add("cleared");
    cell.nearby !== 0 ? cell.element.innerHTML = cell.nearby : cell.element.innerHTML = "";
  }
}

let game = new Game();
let grid;

// DOM generation
window.onload = function() {
  for(y = 0; y < game.rows; y++) {
    for(x = 0; x < game.columns; x++) {
      const container = document.getElementById("grid"); // Stores the container element in variable called container
      const element = document.createElement("div"); // stores the type of element (div) we want to append in variable called element
      container.appendChild(element); // adds this element to the container
      element.setAttribute('data-x', x);
      element.setAttribute('data-y', y);
      element.setAttribute('onClick', `cellClicked(${x}, ${y})`);
      element.classList.add('cell');
      element.addEventListener("contextmenu", function(event) {
        rightClickFlagging(event, element); // Pass the event parameter to the function
      });
    }
  }
  grid = new Grid();
  gameStart(); // When the window loads, we call the gameStart() function with game.started as false and difficulty set the medium (defaults)
}

function rightClickFlagging(event, element) {
  event.preventDefault(); // Prevent the default context menu
  const flag = element.innerHTML;
  switch(flag) {
    case "":
      element.innerHTML = "!";
      break;
    
    case "!":
      element.innerHTML = "?";
      break;

    case "?":
      element.innerHTML = "";
      break;
  }
}

function difficultyClick(index, difficulty) {
  if(confirm(`Do you want to start a new game with difficulty: ${difficulty}?`)) {
    resetGame();
    element = document.getElementById("diff");
    element.innerHTML = difficulty;
    game.difficultySetting = parseInt(index);
    gameStart();
  }
}

function gameStart() {
  game.started = true;
  console.log("Game started called");
  const diffIndex = game.difficultySetting;
  const maxBombs = game.difficulty[diffIndex];
  generateBombs(maxBombs);
}

// Generates bombs based on difficulty setting.
function generateBombs(maxBombs) {
  console.log(`Generate bombs called with ${maxBombs} max bombs`);
  console.log("Generate Bombs called");
  for(i = 0; i < maxBombs; i++) {
    let bombGenerated = false;
    while(!bombGenerated) {
      const ranX = Math.floor(Math.random()*(((game.columns-1)+1)-0)+0); // Generates a random x coordinate.
      const ranY = Math.floor(Math.random()*(((game.rows-1)+1)-0)+0); // Generates a random y coordinate.
      if(!grid.cell[ranX][ranY].bomb) { // If this location does not have a bomb, we set one here.
        grid.cell[ranX][ranY].bomb = true;
        updateNearby(ranX, ranY);
        game.bombLocations.push([ranX, ranY]); // Add the coordinates to the bombLocations array.
        bombGenerated = true;
      }
    }
  }
}

function updateNearby(x, y) {
  for(const adjustment of game.directions) { // Cycle through each coordinate adjustments found in the directions array
    const dx = adjustment[0]; // Store the x coordinate adjustment
    const dy = adjustment[1]; // Store the y coordinate adjustment
    if(isInsideGrid(x+dx, y+dy) && !grid.cell[x+dx][y+dy].bomb) { // If this new cell 
      grid.cell[x+dx][y+dy].nearby++; // Increment its nearby property to show how many bombs are nearby.
    }
  }
}

function cellClicked(a, b) {
  console.log(`Clicked cell X: ${a}, Y: ${b}`);
  console.log(grid.cell[a][b]);
  if(!game.started) { // If the game hasn't started, clicking will do nothing.
    return;
  }
  a = parseInt(a); // To avoid any wonky string business
  b = parseInt(b); // To avoid any wonky string business
  const cellClearingQueue = []; // Create an array that will hold all cells we need to clear.
  if(!grid.cell[a][b].cleared && !grid.cell[a][b].bomb) { // If the cell we just clicked is cleared, does not contain a bomb and the game has started
    cellClearingQueue.push([a, b]); // We push it to the array of cells we need to clear
    for(i = 0; i < cellClearingQueue.length; i++) {
      const x = cellClearingQueue[i][0];
      const y = cellClearingQueue[i][1];
      grid.clearCell(x, y); // Reveals the cell
      if(grid.cell[x][y].nearby === 0) { // If the cell just cleared has 0 nearby, we clear all cells adjacent to them by pushing them into the cellClearingQueue array.
        for(const adjustment of game.directions) { // Cycles through each set of coordinates from the directions array
          const newX = x+adjustment[0];
          const newY = y+adjustment[1];
          if(isInsideGrid(newX, newY) && !alreadyInClearArray(newX, newY)) { // If this new cell location is inside of the grid area and not already in the cellClearingQueue array,
            cellClearingQueue.push([newX, newY]); // we add it to the cellClearingQueue array.
          }
        }
      }
    }
  } else if(grid.cell[a][b].bomb) {
    game.started = false;
    grid.revealBombs();
    alert("You clicked a bomb. GAME OVER! Choose a difficulty setting to start a new game.")
  }

  // Helper function to check whether a cell's coordinates were already added to the cellClearingQueue array.
  function alreadyInClearArray(x, y) {
    for(const coordinate of cellClearingQueue) { // Cycle through the coordinates in cellClearingQueue
      if(coordinate[0] === x && coordinate[1] === y) { // If both the x and y coordinates match, then the cell coordinates already exist in the array and we return true
        return true;
      }
    }
    return false; // Returns false if no matches were found during the for of loop
  }
}

// Helper function to make checking whether a coordinate is within the grid.
function isInsideGrid(x, y) {
  return x >= 0 && x < game.columns && y >= 0 && y < game.rows;
}

function resetGame() {
  game = new Game();
  grid = new Grid();
}