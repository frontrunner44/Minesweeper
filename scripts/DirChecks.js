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