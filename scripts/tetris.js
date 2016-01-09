

var ASS_time = 2,
	DAS_time = 15,
	GRAV_time = 48,
	DROP_time = 2,
	LOCK_time = 25,
	LINECLEAR_time = 10;

var ASS_timer = timeManager.addTimer(ASS_time, true, false)
var DAS_timer = timeManager.addTimer(DAS_time, false, false)
var GRAV_timer = timeManager.addTimer(GRAV_time, true, true)
var DROP_timer = timeManager.addTimer(DROP_time, true, false)
var LOCK_timer = timeManager.addTimer(LOCK_time, false, false)
var LINECLEAR_timer = timeManager.addTimer(LINECLEAR_time, false, false)


var cur_Tetro;
var ghostTetro;

//strore collision information
var cDown = false
var	cLeft = false
var cRight = false

var score = 0
var level = 0
var lines = 100

var full_rows = []
var tetro_dir = ""

var LOCK_DELAY_ON = false
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Grid = {}

	Grid.width = 12
	Grid.height = 26
	Grid.size = 20
	Grid.cells = //generates 2d 12x22 empty grid

	Grid.draw = function(ctx)
	{	
		for(i = 0; i < Grid.width; i++){
			for(v = 0; v < Grid.height; v++){
				
				if (Grid.cells[v][i] != 0){
					drawRect(ctx, i * Grid.size + 2, v * Grid.size, Grid.size, Grid.size, 3, 2, "rgb(25,25,25)", COLORS[Grid.cells[v][i]])
				}
			}
		}
	}

	Grid.createTetrisGrid = function(x,y)
	{
		var arr = [];
		for (var i = 0; i < Grid.height; i++ )
		{
			arr.push([])
			for( var v = 0; v < Grid.width; v++){ arr[i].push(0) }
		}
		Grid.cells =  arr;
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tetromino(shape_index, color)
{
	this.x = 4
	this.y = 2
	//handles fact that I block matrix is bigger and ths requires different starting position
	if (shape_index == 0){
		this.y = 1
		this.x = 3
	}

	this.shape = SHAPES[shape_index]
	this.shape_index = shape_index
	this.ori = 0
	this.color = color
	


	this.rotate = function(tetro_dir)
	{
		this.ori += tetro_dir
		if (this.ori > 3){ this.ori = 0 }
		if (this.ori < 0) { this.ori = 3 }
	}
}


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

CommitTetro = function()
{
	for (i = 0; i < cur_Tetro.shape[cur_Tetro.ori].length; i++)
	{
		for (v = 0; v < cur_Tetro.shape[cur_Tetro.ori][i].length; v++)
		{
			if (cur_Tetro.shape[cur_Tetro.ori][i][v] != 0)
			{
				cell_x = cur_Tetro.x + v  //add 1 to account for grid offset
				cell_y = cur_Tetro.y + i

				if (cell_y < 6){Game.change_state(End_State)}

				Grid.cells[cell_y][cell_x] = cur_Tetro.color 
				}
			}
		}
	tetro_hit.play()
	cur_Tetro = Randomizer.getPiece()
	ghostTetro = new tetromino(cur_Tetro.shape_index, 0)
}


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

RotateTetro = function(tetro_dir){
	
	var prev_ori = cur_Tetro.ori
	cur_Tetro.rotate(tetro_dir)
	var ori = cur_Tetro.ori
	
	var WallKickOffsets

	if (cur_Tetro.shape_index  == 0) {wallKickOffsets = WALLKICKS_I}
	else {wallKickOffsets = WALLKICKS}
	
	for (off = 0; off < wallKickOffsets[0].length; off++){
		
		x_offset = wallKickOffsets[ori][off][0] - wallKickOffsets[prev_ori][off][0]
		y_offset = wallKickOffsets[ori][off][1] - wallKickOffsets[prev_ori][off][1]

		cur_Tetro.x += x_offset
		cur_Tetro.y += y_offset 

		overlap_check: {
			for (i = 0; i < cur_Tetro.shape[cur_Tetro.ori].length; i++)
			{
				for (v = 0; v < cur_Tetro.shape[cur_Tetro.ori][i].length; v++)
				{
					if (cur_Tetro.shape[cur_Tetro.ori][i][v] != 0){

						cell_x = cur_Tetro.x + v  //add 1 to account for grid offset
						cell_y = cur_Tetro.y + i

						if ((cell_x < 0) || (cell_x >= Grid.width) || cell_y >= Grid.height)
						{
						 	cur_Tetro.x -= x_offset; cur_Tetro.y -= y_offset; 
						 	break overlap_check 
						}

						if (Grid.cells[cell_y][cell_x] != 0) 
						{ 
							cur_Tetro.x -= x_offset; cur_Tetro.y -= y_offset; 
						    break overlap_check 
						}
					}
				}
			}
		return
		}
	}
	cur_Tetro.rotate(-tetro_dir)
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

CheckTetroCollision = function(){

	
	for (i = 0; i < cur_Tetro.shape[cur_Tetro.ori].length; i++)
	{
		for (v = 0; v < cur_Tetro.shape[cur_Tetro.ori][i].length; v++)
		{
			if (cur_Tetro.shape[cur_Tetro.ori][i][v] != 0)
			{
				cell_x = cur_Tetro.x + v  
				cell_y = cur_Tetro.y + i

				if (cell_x < 0) {cLeft = true;}
				else if ((Grid.cells[cell_y][cell_x - 1] != 0)) { cLeft = true } 
				
				if (cell_x >= Grid.width) {cRight = true;}
				else if ((Grid.cells[cell_y][cell_x + 1] != 0)) { cRight = true}
				
				if (cell_y >= Grid.height - 1) {cDown = true;}
				else if  (Grid.cells[cell_y + 1][cell_x] != 0) { cDown = true}

			}
		}
	}



}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

CheckRows = function(){

	var FilledRows = []

	for (var i = Grid.height - 1; i > 0; i--)
	{
		var counter = 0
		
		for (var v = 0; v < Grid.width; v++)
		{
			if (Grid.cells[i][v] != 0) {counter++}
			if (counter == Grid.width) { FilledRows.push(i)}
		}
	}
	full_rows = FilledRows
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

CollapseRows = function()
{
	for (var i = full_rows.length - 1; i >= 0; i--)
	{
		Grid.cells.splice(full_rows[i],1)
		Grid.cells.unshift([])

		for (var v = 0; v < Grid.width; v++)
		{
			Grid.cells[0].push([])
		}
	}
	//updates scores
	if (full_rows.length == 1) {score += (40 * (level + 1))}
	if (full_rows.length == 2) {score += (100 * (level + 1))}
	if (full_rows.length == 3) {score += (300 * (level + 1))}
	if (full_rows.length == 4) {score += (1200 * (level + 1))}

	lines += full_rows.length
	level = Math.floor(lines / 10)

	if (level > 29) {GRAV_timer.length = 1}
				else{GRAV_timer.length = GRAV_SPEEDS[level]}

	full_rows = []
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

DrawTetromino = function(cur_Tetro, x, y, size, color)
{
	for (var i = 0; i < cur_Tetro.shape[cur_Tetro.ori].length; i++)
	{
		for (var v = 0; v < cur_Tetro.shape[cur_Tetro.ori][i].length; v++)
		{
			if (cur_Tetro.shape[cur_Tetro.ori][i][v] != 0)
			{
				drawRect(ctx, (v * size) + (x), (i * size) + (y), size, size, 3, 2, "rgb(30,30,30)", color)
			}
				
		}
	}
}

var Randomizer = {}

	Randomizer.pieces = []

	Randomizer.generate = function()
	{
		arr = [0,1,2,3,4,5,6]

		for( var i = 7; i >= 1; i--) 
		{
			index = randrange(0, i)
			randpiece = arr.splice(index, 1)[0]
			Randomizer.pieces.push(new tetromino(randpiece, randpiece + 1))
		}
	}

	Randomizer.getPiece = function()
	{
		if (Randomizer.pieces.length < 5){Randomizer.generate()}
		return Randomizer.pieces.shift()
	}




placeGhostTetro = function()
{
	while(true)
	{
		for (i = 0; i < ghostTetro.shape[ghostTetro.ori].length; i++)
		{
			for (v = 0; v < ghostTetro.shape[ghostTetro.ori][i].length; v++)
			{
				if (ghostTetro.shape[ghostTetro.ori][i][v] != 0)
				{
					cell_x = ghostTetro.x + v  
					cell_y = ghostTetro.y + i
					if (cell_y >= Grid.height - 1) {return}
					else if  (Grid.cells[cell_y + 1][cell_x] != 0) { return}
				}
			}
		}
		ghostTetro.y += 1
	}
}