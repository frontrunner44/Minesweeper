// New, non recursive function for checking cells
function checkCells(a) { // Parameter takes the index from the clicked cell.
	let cellIndex = [a]; // Adds the clicked cell to the first index of the array that holds the cells to check.
	for(let i=0; i<cellIndex.length; i++) { // Iterates through each cell that needs checking
		let x = cellIndex[i];
		if(game.cell[x].cleared === false && game.started === true && game.cell[x].bomb === false) { // Checks if the currenct cell isn't cleared, has no bombs and the game hasn't ended
			clearThisCell(cellIndex[i]); 
			if(game.cell[x].nearby === 0) {
				// directional checks here -- check direction AND whether the adjacent cell is already in cellIndex[]
				if(!game.cell[x].leftEdge && !cellIndex.includes(x-1)) { // Check current cell for being on the left
					cellIndex.push((x-1);
				}
				if(!game.cell[x].rightEdge && !cellIndex.includes(x+1)) { // Check if current cell isn't on the right edge.
					cellIndex.push((i+1); 
				}
				if(!game.cell[x].topEdge && !cellIndex.includes(x-game.gridWidth)) { // Checks if current cell is not on the top row/edge.
					cellIndex.push((x-game.gridWidth); 
				}
				if(!game.cell[x].bottomEdge && !cellIndex.includes(x+game.gridWidth)) { // Checks if the current cell is on the bottom row/edge.
					cellIndex.push((x+game.gridWidth);
				}
				if(!game.cell[x].topEdge && !game.cell[x].leftEdge && !cellIndex.includes(x-(game.gridWidth+1))) { // Checks if the current cell is either on the left or top edges.
					cellIndex.push((x-(game.gridWidth+1));
				}
				if(!game.cell[x].topEdge && !game.cell[x].rightEdge && !cellIndex.includes(x-(game.gridWidth-1))) { // Checks if the current cell is either on the right or the top edges.
					cellIndex.push((x-(game.gridWidth-1));
				}
				if(!game.cell[x].bottomEdge && !game.cell[x].rightEdge && !cellIndex.includes(x+game.gridWidth+1)) { // Checks if the current cell is either on the right or the bottom edges.
					cellIndex.push((x+game.gridWidth+1);
				}
				if(!game.cell[x].leftEdge && !game.cell[x].bottomEdge && !cellIndex.includes(x+(game.gridWidth-1))) { // Checks if the current cell is either on the left or bottom edges.
					cellIndex.push((x+(game.gridWidth-1));
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