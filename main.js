//Checks if it's the AI turn and if so it calls MiniMax and plays the returned move
function AiTurn()
{
	if(!isWhiteTurn)
				{
					var node = AIopponent.getNextMove(copy(ground));
					if (ground[node.piece.y][node.piece.x] !=null)
					{
						ground[node.piece.y][node.piece.x].EraseSelf();
					}
					ground = node.ground;
					ground[node.piece.y][node.piece.x].DrawSelf();
					activePiece = null;
					label.innerHTML = getCheck('White') ? "CHECK":"";
					isWhiteTurn = !isWhiteTurn;
				}
}
//Draws an 8x8 chess grid on the canvas
function DrawGround(canvas)
{
	var context = canvas.getContext('2d')
	var DrawY = 0;
	for (var i = 0; i < 8; i++) 
	{
		DrawX = 0;
		for(var x = 0;x<8;x++)
		{
			if ((x+i)%2 == 0){context.fillStyle = 'White';}
			else{context.fillStyle = '#60aeb5';}
			context.fillRect(DrawX,DrawY,canvas.width/8,canvas.height/8);
			DrawX+=canvas.width/8;
		}

		DrawY+=canvas.height/8
	}
}
//Handles Clicks, which includes drawing and erasing move sprites 
function OnClick(event) 
{


	var move = null;
	var coordinates = GetRelativePos(event);
	var skip = false;
		
		//Handles Turns
		if(ground[coordinates[1]][coordinates[0]] != null){
			if((!isWhiteTurn && ground[coordinates[1]][coordinates[0]].color == 'White' && activePiece == null)||(isWhiteTurn && ground[coordinates[1]][coordinates[0]].color == 'Black' && activePiece == null))
			{skip = true;}
		}
		//Handles Move
		if(!(ground[coordinates[1]][coordinates[0]] == null && activePiece == null) && activePiece != null &&(ground[coordinates[1]][coordinates[0]] == null   || (coordinates[0] !=activePiece.x || coordinates[0] !=activePiece.y)) )
		{
			
			move = activePiece.moves.filter(move => move[0] == coordinates[0] && move[1] == coordinates[1]);
			if (move.length !=0)
			{
				ground[activePiece.y][activePiece.x] = null;
				activePiece.x = move[0][0];
				activePiece.y = move[0][1];
				if (ground[coordinates[1]][coordinates[0]] !=null)
					ground[coordinates[1]][coordinates[0]].EraseSelf();
				ground[coordinates[1]][coordinates[0]] = activePiece;
				activePiece.DrawSelf();
				label.innerHTML = getCheck('White') ? "CHECK":"" ;
				isWhiteTurn = !isWhiteTurn;
				

				
				

			}
			
			EraseMoveSprites(activePiece);
			activePiece = null;

		}
		//Handles drawing moves
		else if (!skip && !(ground[coordinates[1]][coordinates[0]] == null && activePiece == null))
		{	
			if (activePiece != null){
			for (var i = activePiece.moves.length - 1; i >= 0; i--) 
			{
			if ((activePiece.moves[i][0]+activePiece.moves[i][1])%2 == 0){context.fillStyle = 'White';}
			else{context.fillStyle = '#60aeb5';}
			context.fillRect(activePiece.moves[i][0]*canvas.width/8,activePiece.moves[i][1]*canvas.height/8,canvas.width/8,canvas.height/8);
			
			}
		}
			activePiece = ground[coordinates[1]][coordinates[0]];
			activePiece.getMoves(ground);
			drawMoves(activePiece);

		}

}
function GetRelativePos(event)
{
	var canvas = document.getElementById('window');
	var rect = canvas.getBoundingClientRect();
	var coordinates = new Array(2);
	coordinates[0] = Math.floor(((event.x - rect.left)/canvas.width) * 8);
	coordinates[1] = Math.floor(((event.y - rect.top)/canvas.height) * 8);

	return coordinates;
}
function drawMoves(piece)
{
	context.fillStyle = 'green';
	for (var i = piece.moves.length - 1; i >= 0; i--) {
		context.beginPath();
		coordinates = [(piece.moves[i][0]+0.5)*canvas.width/8,(piece.moves[i][1]+0.5)*canvas.height/8]
		context.arc(coordinates[0],coordinates[1],10,0,2*Math.PI);
		context.fill();
		context.stroke();
	}
}
function IntializeGround()
{
	var ground = new Array(8);
	for (var rows = ground.length - 1; rows >= 0; rows--) {
		ground[rows] = new Array(8);
	}
	for (var y = ground.length - 1; y >= 0; y--) {
		for (var x = ground[y].length-1; x >= 0; x--)
		{
			if (y == 6)
				ground[y][x] = new Pawn('White',[x,y]);

			else if (y == 1)
				ground[y][x] = new Pawn('Black',[x,y]);

			else if (y == 0 || y == 7)
			{
				if (y==0)
					color = 'Black';
				else
					color = 'White';
				if (x ==0 || x==7)
					ground[y][x] = new Rook(color,[x,y]);
				if(x == 1 || x == 6)
					ground[y][x] = new Knight(color,[x,y]);
				if(x == 2 || x == 5)
					ground[y][x] = new Bishop(color,[x,y]);
				if(x == 3)
					ground[y][x] = new Queen(color,[x,y]);
				if(x == 4)
					ground[y][x] = new King(color,[x,y]);

			}
			else
				ground[y][x] = null;
		}
	}
	//console.log(ground);
	return ground;
}
function getCheck(color)
{
	var king;

	for (var y = ground.length - 1; y >= 0; y--)
	{
		filteredRow = ground[y].filter(piece => piece instanceof King && piece.color == color)
		if (filteredRow.length !=0)
		{
			king = filteredRow[0];
		}
		
	}
	return king.getCheckStatus(ground);

}
function EraseMoveSprites(activePiece)
{
	for (var i = activePiece.moves.length - 1; i >= 0; i--) 
			{
				if ((activePiece.moves[i][0]+activePiece.moves[i][1])%2 == 0){context.fillStyle = 'White';}
				else{context.fillStyle = '#60aeb5';}
				context.fillRect(activePiece.moves[i][0]*canvas.width/8,activePiece.moves[i][1]*canvas.height/8,canvas.width/8,canvas.height/8);
				if (ground[activePiece.moves[i][1]][activePiece.moves[i][0]]!= null)
				{
					ground[activePiece.moves[i][1]][activePiece.moves[i][0]].DrawSelf();
				}

			}
}
//changes Difficulty
function ChangeDiff()
{
	AIopponent = new MiniMax(diffSlider.value);
	diffLabel.innerHTML = "Difficulty: "+diffSlider.value;
}
var canvas = document.createElement('canvas');
var label = document.getElementById('CheckLabel');
var diffSlider = document.getElementById('DepthSlider');
var diffLabel = document.getElementById('diffLabel');
var context = canvas.getContext('2d');
canvas.id = 'window';
canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:2px solid black";
canvas.height = canvas.width = 800;
DrawGround(canvas);
var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
document.addEventListener('click',OnClick);
var ground = IntializeGround();
activePiece = null;
var isWhiteTurn = true;
var AIopponent = new MiniMax(diffSlider.value);
diffLabel.innerHTML = "Difficulty: "+diffSlider.value;
setInterval(AiTurn,100);