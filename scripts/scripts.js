const gameDefaults = {
  columns: 30,
	rows: 30,
	started: false,
	difficultySetting: 1,
	difficulty: [50,80,140],
	clearedCClass: "cleared",
	score: 0,
  grid: [],
  bombLocations: [],
  cellDefaults: {
    bomb: false,
		cleared: false,
		nearby: 0,
    element: undefined,
  },
  directions: [[-1, 0], [-1, -1], [0, -1], [+1, -1], [+1, 0], [+1, +1], [0, +1], [-1, +1]] // For directional checks
}
let game = structuredClone(gameDefaults);

// Grid generation
window.onload = function() {
  for(y = 0; y < game.rows; y++) {
    for(x = 0; x < game.columns; x++) {
      if(y === 0) {
        game.grid.push([]); // Initializes the columns on first passthrough.
      }
      const container = document.getElementById("grid"); // Stores the container element in variable called container
      const element = document.createElement("div"); // stores the type of element (div) we want to append in variable called element
      container.appendChild(element); // adds this element to the container
      element.setAttribute('data-x', x);
      element.setAttribute('data-y', y);
      element.setAttribute('onClick', `cellClicked(${x}, ${y})`);
      element.classList.add('cell');
      game.grid[x][y] = structuredClone(game.cellDefaults); // Pushes a cell object with default values into [x][y] of game.grid.
      game.grid[x][y].element = element; // Stores a reference to the dom element as a parameter called element.
      element.addEventListener("contextmenu", function(event) {
        rightClickFlagging(event, element); // Pass the event parameter to the function
      });
    }
  }
  gameStart(); // When the window loads, we call the gameStart() function with game.started as false and difficulty set the medium (defaults)
}

function rightClickFlagging(event, element) {
  event.preventDefault(); // Prevent the default context menu
  const flag = element.innerHTML;

  switch(flag) {

    case "":
      element.innerHTML = "?";
      break;
    
    case "?":
      element.innerHTML = "!";
      break;

    case "!":
      element.innerHTML = "";
      break;
  }
}

function difficultyClick(index, difficulty) {
  if(confirm(`Do you want to start a new game with difficulty: ${difficulty}?`)) {
    game.started = true;
    element = document.getElementById("diff");
    element.innerHTML = difficulty;
    game.difficultySetting = parseInt(index);
    gameStart();
  }
}

function gameStart() {
  console.log("Game started called");
  game.started ? resetGame() : game.started = true; // If the game already started when this is called, we reset the game before starting the game again.
  const diffIndex = game.difficultySetting;
  const maxBombs = game.difficulty[diffIndex];
  generateBombs(maxBombs);
}

// Generates bombs based on difficulty setting.
function generateBombs(maxBombs) {
  console.log("Generate Bombs called");
  for(i = 0; i < maxBombs; i++) {
    let bombGenerated = false;
    while(!bombGenerated) {
      const ranX = Math.floor(Math.random()*(((game.columns-1)+1)-0)+0); // Generates a random x coordinate.
      const ranY = Math.floor(Math.random()*(((game.rows-1)+1)-0)+0); // Generates a random y coordinate.
      if(!game.grid[ranX][ranY].bomb) { // If this location does not have a bomb, we set one here.
        game.grid[ranX][ranY].bomb = true;
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
    if(isInsideGrid(x+dx, y+dy) && !game.grid[x+dx][y+dy].bomb) { // If this new cell 
      game.grid[x+dx][y+dy].nearby++; // Increment its nearby property to show how many bombs are nearby.
    }
  }
}

function cellClicked(a, b) {
  console.log(`Clicked cell X: ${a}, Y: ${b}`);
  console.log(game.grid[a][b]);
  if(!game.started) { // If the game hasn't started, clicking will do nothing.
    return;
  }
  a = parseInt(a); // To avoid any wonky string business
  b = parseInt(b); // To avoid any wonky string business
  const clearTheseCells = []; // Create an array that will hold all cells we need to clear.
  if(!game.grid[a][b].cleared && !game.grid[a][b].bomb) { // If the cell we just clicked is cleared, does not contain a bomb and the game has started
    clearTheseCells.push([a, b]); // We push it to the array of cells we need to clear
    for(i = 0; i < clearTheseCells.length; i++) {
      const x = clearTheseCells[i][0];
      const y = clearTheseCells[i][1];
      clearCell(x, y); // Reveals the cell
      if(game.grid[x][y].nearby === 0) { // If the cell just cleared has 0 nearby, we clear all cells adjacent to them by pushing them into the clearTheseCells array.
        for(const adjustment of game.directions) { // Cycles through each set of coordinates from the directions array
          const newX = x+adjustment[0];
          const newY = y+adjustment[1];
          if(isInsideGrid(newX, newY) && !alreadyInClearArray(newX, newY)) { // If this new cell location is inside of the grid area and not already in the clearTheseCells array,
            clearTheseCells.push([newX, newY]); // we add it to the clearTheseCells array.
          }
        }
      }
    }
  } else if(game.grid[a][b].bomb) {
    game.started = false;
    revealBombs();
    alert("You clicked a bomb. GAME OVER! Choose a difficulty setting to start a new game.")
  }
  // Helper function to check whether a cell's coordinates were already added to the clearTheseCells array.
  function alreadyInClearArray(x, y) {
    for(const coordinate of clearTheseCells) { // Cycle through the coordinates in clearTheseCells
      if(coordinate[0] === x && coordinate[1] === y) { // If both the x and y coordinates match, then the cell coordinates already exist in the array and we return true
        return true;
      }
    }
    return false; // Returns false if no matches were found during the for of loop
  }
}

function revealBombs() {
  for(const coordinates of game.bombLocations) {
    const x = coordinates[0];
    const y = coordinates[1];
    game.grid[x][y].element.classList.add("bombreveal");
  }
}

// Helper function to make checking whether a coordinate is within the grid.
function isInsideGrid(x, y) {
  return x >= 0 && x < game.columns && y >= 0 && y < game.rows;
}

function clearCell(x, y) {
  cell = game.grid[x][y];
  cell.cleared = true;
  cell.flagged = "";
  cell.element.classList.add("cleared");
  cell.nearby !== 0 ? cell.element.innerHTML = cell.nearby : cell.element.innerHTML = "";
}

function resetGame() {
  console.log("Reset game called");
  game.bombLocations = [];
  // Iterate through every cell and reset to default values (preserve element)
  for(y = 0; y < game.rows; y++) {
    for(x = 0; x < game.columns; x++) {
      const element = game.grid[x][y].element; // Store a temporay reference to the cell's respective DIV element.
      game.grid[x][y] = structuredClone(game.cellDefaults) // Restore defaults
      game.grid[x][y].element = element; // Restore the DIV reference
      game.grid[x][y].element.classList.remove("cleared"); // Remove cleared styling
      game.grid[x][y].element.classList.remove("bombreveal"); // Remove bombreveal styling
      game.grid[x][y].element.innerHTML = ""; // Remove any innerHTML
    }
  }
}