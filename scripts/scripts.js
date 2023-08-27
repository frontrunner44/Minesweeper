const gameDefaults = {
	cell:[{
		bomb: false,
		cleared: false,
		nearby:0,
		flagged:false,
		leftEdge:false,
		rightEdge:false,
		topEdge:false,
		bottomEdge:false

	}],
	gridWidth:30,
	gridSize: 30*30,
	started:false,
	difficultySetting:1,
	difficulty:[50,80,140],
	clearColor:"white",
	flagged:"none"
}
let game = structuredClone(gameDefaults); // Clones the default values from the gameDefaults object into a new usable object called game.



// Generate Grid
$(document).ready(function(){
  // Grid generation and cell setup
	for(let i=0; i<game.gridSize; i++) {
  		$("#grid").append("<div class='cell' onclick='checkCells("+i+")' data-pos='"+i+"'></div>");
	}
	
	// Right-click functionality
	$(".cell").contextmenu(function() {
		let clickLoc = $(this).data('pos');
	  let $cell = $(".cell").eq(clickLoc);
	  if (game.cell[clickLoc].cleared === false) {
	    switch (game.cell[clickLoc].flagged) {
	      case "!":
	        $cell.html("?");
	        game.cell[clickLoc].flagged = "?";
	        break;
	      case "?":
	        $cell.html("");
	        game.cell[clickLoc].flagged = "";
	        break;
	      default:
	        $cell.html("!");
	        game.cell[clickLoc].flagged = "!";
	    }
	  }
	  return false; // Prevents right click popup menu.
});
	gameStart();
})

function gameStart() {
	game.started = true;
	for(i=0; i<game.gridSize; i++) {
			game.cell[i] = structuredClone(gameDefaults.cell[0]); // Populates the cells with default values
  		if(i % game.gridWidth  === 0) { // Checks if current cell is on left edge.
  			game.cell[i].leftEdge = true;
  		}
  		if(i%game.gridWidth+1 === game.gridWidth) { // Checks if current cell is on the right edge
  			game.cell[i].rightEdge = true;
  		}
  		if(i<game.gridWidth) { // Checks if the current cell is on the top row/edge.
  			game.cell[i].topEdge = true;
  		}
  		if(i>=game.gridSize-game.gridWidth) { // Checks if the current cell is on the bottom row/edge.
  			game.cell[i].bottomEdge = true;
  		}
  		// recolor bg logic
  		$(".cell").eq(i).css("background-color","grey");
  		// get rid of added html logic
  		$(".cell").eq(i).html("");
  	}
  	generateBombs(game.difficulty[game.difficultySetting]);
}

$("button").click(function(){
	if(confirm("Do you want to reset the game on "+$(this).data('diff').toLowerCase()+" difficulty?")) {
		game.difficultySetting = parseInt($(this).data("speed"));
		gameStart();
		$("#diff").html($(this).data("diff"));
	}
});

// Cell clearing and checking logic
function checkCells(a) { // Parameter takes the index from the clicked cell.
	let cellIndex = [a]; // Adds the clicked cell to the first index of the array that holds the cells to check.
	for(let i=0; i<cellIndex.length; i++) { // Iterates through each cell that needs checking
		let x = cellIndex[i];
		if(game.cell[x].cleared === false && game.started === true && game.cell[x].bomb === false) { // Checks if the currenct cell isn't cleared, has no bombs and the game hasn't ended
			clearThisCell(cellIndex[i]); 
			if(game.cell[x].nearby === 0) {
				// directional checks here -- check direction AND whether the adjacent cell is already in cellIndex[]
				if(!game.cell[x].leftEdge && !cellIndex.includes(x-1)) { // Check current cell for being on the left
					cellIndex.push(x-1);
				}
				if(!game.cell[x].rightEdge && !cellIndex.includes(x+1)) { // Check if current cell isn't on the right edge.
					cellIndex.push(x+1); 
				}
				if(!game.cell[x].topEdge && !cellIndex.includes(x-game.gridWidth)) { // Checks if current cell is not on the top row/edge.
					cellIndex.push(x-game.gridWidth); 
				}
				if(!game.cell[x].bottomEdge && !cellIndex.includes(x+game.gridWidth)) { // Checks if the current cell is on the bottom row/edge.
					cellIndex.push(x+game.gridWidth);
				}
				if(!game.cell[x].topEdge && !game.cell[x].leftEdge && !cellIndex.includes(x-(game.gridWidth+1))) { // Checks if the current cell is either on the left or top edges.
					cellIndex.push(x-(game.gridWidth+1));
				}
				if(!game.cell[x].topEdge && !game.cell[x].rightEdge && !cellIndex.includes(x-(game.gridWidth-1))) { // Checks if the current cell is either on the right or the top edges.
					cellIndex.push(x-(game.gridWidth-1));
				}
				if(!game.cell[x].bottomEdge && !game.cell[x].rightEdge && !cellIndex.includes(x+game.gridWidth+1)) { // Checks if the current cell is either on the right or the bottom edges.
					cellIndex.push(x+game.gridWidth+1);
				}
				if(!game.cell[x].leftEdge && !game.cell[x].bottomEdge && !cellIndex.includes(x+(game.gridWidth-1))) { // Checks if the current cell is either on the left or bottom edges.
					cellIndex.push(x+(game.gridWidth-1));
				}
			}
		} else if(game.cell[x].bomb === true && game.started === true) {
			game.started = false;
			for(let b=0; b<game.gridSize; b++) {
				if(game.cell[b].bomb === true) {
					$(".cell").eq(b).css("background-color","red");
				}
			}
			alert("You clicked a bomb! You lose! Press ok and choose a difficulty to play again.");
		}
	}
}

// Function to clear the current cell only.
function clearThisCell(i) {
	game.cell[i].cleared = true;
	game.cell[i].flagged = "none";
	$(".cell").eq(i).css("background-color",game.clearColor); // change this later for better visuals
	$(".cell").eq(i).html(""); // Removes any flags
	if(game.cell[i].nearby !== 0) {
		$(".cell").eq(i).html("<span style='color:blue'>"+game.cell[i].nearby+"</span>"); // logic for displaying the nearby number on the cell here
	}
}

function generateBombs(amount) {
	for(i=0; i<amount; i++) {
		let bombGenerated = false;
		while(!bombGenerated) {
			let a = randomNumber(0,game.gridSize-1);
			if(game.cell[a].bomb === false) {
				game.cell[a].bomb = true;
				bombGenerated = true;
				updateNearby(a);
			}
		}
	}
}

// Generate a random number between two values, inclusive. Still need to go around and update the places I need to use this.
function randomNumber(min, max) {
  return Math.floor(Math.random()*((max+1)-min)+min);
}

// function for updating nearby cells ".nearby" values once a bomb is placed
function updateNearby(i) {
	if(!game.cell[i].leftEdge) { // Check current cell for being on the left
		game.cell[i-1].nearby++;
	}
	if(!game.cell[i].rightEdge) { // Check if current cell isn't on the right edge.
		game.cell[i+1].nearby++; 
	}
	if(!game.cell[i].topEdge) { // Checks if current cell is not on the top row/edge.
		game.cell[i-game.gridWidth].nearby++; 
	}
	if(!game.cell[i].bottomEdge) { // Checks if the current cell is on the bottom row/edge.
		game.cell[i+game.gridWidth].nearby++;
	}
	if(!game.cell[i].topEdge && !game.cell[i].leftEdge) { // Checks if the current cell is either on the left or top edges.
		game.cell[i-(game.gridWidth+1)].nearby++;
	}
	if(!game.cell[i].topEdge && !game.cell[i].rightEdge) { // Checks if the current cell is either on the right or the top edges.
		game.cell[i-(game.gridWidth-1)].nearby++;
	}
	if(!game.cell[i].bottomEdge && !game.cell[i].rightEdge) { // Checks if the current cell is either on the right or the bottom edges.
		game.cell[i+game.gridWidth+1].nearby++;
	}
	if(!game.cell[i].leftEdge && !game.cell[i].bottomEdge) { // Checks if the current cell is either on the left or bottom edges.
		game.cell[i+(game.gridWidth-1)].nearby++;
	}
}