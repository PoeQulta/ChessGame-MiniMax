//create Deep copies
function copy(o) 
		{
   			var output, v, key;
   			if (o == null)
   				return null;
   			else
   			{
   				output = Array.isArray(o) ? [] : new (o.constructor)('White',[null,null],false);
   				for (key in o)
   				{
      				 v = o[key];
       				output[key] = (typeof v === "object") ? copy(v) : v;
   				}
   				return output;
   			}
		}
//defines general piece Class
class Piece
{
	constructor(color,position)
	{
		this.color = color;
		this.x = position[0];
		this.y = position[1];
		this.old = {x:this.x,y:this.y};
		this.moves = new Array();
		
	}
	//gets Coordinates of possible moves given a list of relative moves
	getAbsoluteMoves(ground,relativeMoves, Isdirections=false,x = this.x, y = this.y)
	{
		var moves = new Array();
		for (var i = relativeMoves.length - 1; i >= 0; i--) 
		{
			
			var move = relativeMoves[i];
			
			if(Isdirections)
			{
				var j = 1;
				while(true)
				{	
					if ((x+j*move[0]>=0 && x+j*move[0]<=7) && (y+j*move[1]>=0 && y+j*move[1]<=7) && (ground[y+j*move[1]][x+j*move[0]] == null || ground[y+j*move[1]][x+j*move[0]].color !=this.color))
					{
						moves.push([x+j*move[0],y+j*move[1]]);
						if (ground[y+j*move[1]][x+j*move[0]] != null)
							break;
					}
					else
						break;
					j++;
				}
			}
			else
			{
				if ((this.x+move[0]>=0 && this.x+move[0]<=7) && (this.y+move[1]>=0 && this.y+move[1]<=7) && (ground[this.y+move[1]][this.x+move[0]] == null || ground[this.y+move[1]][this.x+move[0]].color !=this.color))
					{
						moves.push([this.x+move[0],this.y+move[1]]);
					}
			}
		}
		return moves;
	}
	DrawSelf()
		{
			var image = new Image();
			var canvas = document.getElementById('window');
			var context = canvas.getContext('2d');
			image.data = {x:this.x,y:this.y}
			this.EraseSelf();
			this.old.x = this.x;
			this.old.y = this.y;
			image.onload = function(){
				context.drawImage(this,this.data.x*canvas.width/8,this.data.y*canvas.height/8);
			}
			image.src = this.sprite;
			
			
		}
	EraseSelf()
		{
			if ((this.old.x+this.old.y)%2 == 0)
				{context.fillStyle = 'White';}
			else{context.fillStyle = '#60aeb5';}
			context.fillRect(this.old.x*canvas.width/8,this.old.y*canvas.height/8,canvas.width/8,canvas.height/8);
		}
}
class Pawn extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.orientation = (color == 'White') ? -1:1;
		this.sprite = 'sprites/Pawn'+color+'.png';
		if (draw)
			this.DrawSelf();
	}
	//checks if moves are valid according to game rules
	getMoves(ground)
	{
		this.moves = new Array();
		var relativeMoves =[];
		if (this.FirstMove && ground[this.y+2*this.orientation][this.x] == null)
		{
			if (this.y != 6 && this.y != 1 )
				this.FirstMove = false;
			else
			relativeMoves.push([0,2*this.orientation]);
		}
		if (ground[this.y+1*this.orientation][this.x] == null)
			relativeMoves.push([0,this.orientation]);
		if (this.x+1<=7 && ground[this.y+1*this.orientation][this.x+1] != null)
			relativeMoves.push([1,this.orientation]);
		if (this.x-1>=0 && ground[this.y+1*this.orientation][this.x-1] != null && ground[this.y+1*this.orientation][this.x-1].color !=this.color)
			relativeMoves.push([-1,this.orientation]);
		this.moves = this.getAbsoluteMoves(ground,relativeMoves,false);
	}
}
class Rook extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.sprite = 'sprites/Rook'+color+'.png';
		if(draw)
			this.DrawSelf();
	}
	//Defines relative moves and gets their absolute counterparts
	getMoves(ground)
	{
		var relativeDirections = [[1,0],[-1,0],[0,1],[0,-1]];
		this.moves = this.getAbsoluteMoves(ground,relativeDirections,true);
	}
}
class Knight extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.sprite = 'sprites/Knight'+color+'.png';
		if (draw)
			this.DrawSelf();
	}
	//Defines relative moves and gets their absolute counterparts
	getMoves(ground)
	{
		
		var relativeMoves = [[1,-2],[-1,-2],[1,2],[-1,2],[2,1],[2,-1],[-2,1],[-2,-1]];
		this.moves = this.getAbsoluteMoves(ground,relativeMoves,false);
				
	}
}
class Bishop extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.sprite = 'sprites/Bishop'+color+'.png';
		if (draw)
			this.DrawSelf();
	}
	//Defines relative moves and gets their absolute counterparts
	getMoves(ground)
	{
		var relativeDirections = [[1,1],[-1,-1],[1,-1],[-1,1]];
		this.moves = this.getAbsoluteMoves(ground,relativeDirections,true);
	}
}
class Queen extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.sprite = 'sprites/Queen'+color+'.png';
		if (draw)
			this.DrawSelf();
	}
	//Defines relative moves and gets their absolute counterparts
	getMoves(ground)
	{
		var relativeDirections = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
		this.moves = this.getAbsoluteMoves(ground,relativeDirections,true);
	}
}
class King extends Piece
{
	constructor(color,position,draw=true)
	{
		super(color,position);
		this.FirstMove = true;
		this.inCheck = false;
		this.dangerZone = {ls:[],dgnls:[],strts:[]};
		this.sprite = 'sprites/King'+color+'.png';
		if (draw)
			this.DrawSelf();
	}
	//Defines relative moves and gets their absolute counterparts and checks if those moves put the king in check
	getMoves(ground)
	{
		var relativeMoves = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
		var possibleMoves = this.getAbsoluteMoves(ground,relativeMoves,false);
		this.moves = possibleMoves.filter(move => !this.getCheckStatus(ground,move[0],move[1]));
	}
	//gets grid squares that pose possible danger to the king piece
	getDangerZone(ground,x,y)
	{
		this.dangerZone = {ls:[],dgnls:[],strts:[]};
		var relativeDangers = {ls:[],dgnls:[],strts:[]};
		relativeDangers.ls = [[1,-2],[-1,-2],[1,2],[-1,2],[2,1],[2,-1],[-2,1],[-2,-1]];
		relativeDangers.dgnls = [[1,1],[-1,1],[1,-1],[-1,-1]];
		relativeDangers.strts = [[1,0],[-1,0],[0,1],[0,-1]];
		this.dangerZone.ls = this.getAbsoluteMoves(ground,relativeDangers.ls,false,x,y);
		for (var i = relativeDangers.dgnls.length - 1; i >= 0; i--) {
			var diagonal = [relativeDangers.dgnls[i]];
			var result = this.getAbsoluteMoves(ground,diagonal,true,x,y);
			if (typeof result[result.length-1] != 'undefined')
				this.dangerZone.dgnls.push(result[result.length-1]);
		}
		for (var i = relativeDangers.strts.length - 1; i >= 0; i--) {
			var straight = [relativeDangers.strts[i]];
			var result = this.getAbsoluteMoves(ground,straight,true,x,y);
			if (typeof result[result.length-1] != 'undefined')
				this.dangerZone.strts.push(result[result.length-1]);
		}
		return this.dangerZone;
	}
	//checks dangerzone for pieces that can put king in check
	getCheckStatus(playground,x=this.x,y=this.y)
	{
		var inCheck = false;
		var locations2Chk = this.getDangerZone(playground,x,y);
		for (var i = locations2Chk.ls.length - 1; i >= 0; i--) 
		{
			var square = locations2Chk.ls[i]
			if(playground[square[1]][square[0]] instanceof Knight)
				inCheck = true
		}
		for (var i = locations2Chk.dgnls.length - 1; i >= 0; i--)
		{
			square = locations2Chk.dgnls[i]
			if(playground[square[1]][square[0]] instanceof Bishop || playground[square[1]][square[0]] instanceof Queen)
				inCheck = true
		}
		for (var i = locations2Chk.strts.length - 1; i >= 0; i--) {
			square = locations2Chk.strts[i]
			if(playground[square[1]][square[0]] instanceof Rook || playground[square[1]][square[0]] instanceof Queen)
				inCheck = true
		}
		return inCheck;
	}
}
//each node defines a game scenario with all the subsequent senarios 
class Node
{
	constructor(piece,ground,move,parentNode,color,depth,targetdepth=2)
	{
		this.piece = copy(piece);
		this.move = move;
		this.ground = this.makeMove(copy(ground));
		this.score = this.Scoreground(this.ground);
		this.parent = parentNode;
		this.color = color;
		this.oppColor = ['White','Black'].filter(color => color != this.color)[0];
		this.filteredPieces = {self:[],opp:[]};
		this.depth = depth;
		this.targetdepth = targetdepth;
		for (var i = this.ground.length - 1; i >= 0; i--) 
		{
			var row = this.ground[i];
			this.filteredPieces.self.push(...row.filter(piece => piece != null && piece.color==this.color));
			this.filteredPieces.opp.push(...row.filter(piece =>  piece != null && piece.color==this.oppColor));
		}
		if(this.depth==this.targetdepth)
			this.children = [];
		else
			this.children = this.getChildren();

	}
	//gives an integer value to represent how good/bad this scenario is for the AI
	//changes to this function affect the play style of the AI
	Scoreground(playground)
	{
		var score = 0;
		var filteredPieces={self:[],opp:[]};
		for (var i = playground.length - 1; i >= 0; i--) {
			var row = playground[i]
			filteredPieces.self.push(...row.filter(piece => piece != null && piece.color=='Black'));
			filteredPieces.opp.push(...row.filter(piece => piece != null && piece.color=='White'));
		}
		var selfKing = filteredPieces.self.filter(piece =>  piece instanceof King)[0];
		var oppKing = filteredPieces.opp.filter(piece =>  piece instanceof King)[0];
		if (selfKing == null || oppKing == null)
			return -1;
		else{
			score+= 10*oppKing.getCheckStatus(playground);
			score-= 20*selfKing.getCheckStatus(playground);
			score+= this.ScorePieces(filteredPieces.self)*2;
			score-= this.ScorePieces(filteredPieces.opp);
			score+= this.ScoreMoves(filteredPieces.self);
			score+= this.ScoreMoves(filteredPieces.opp);
			return score;
		}
	}
	//private functions used by ScoreGround()
	ScorePieces(pieces)
	{
		var score = 0;
		for (var i = pieces.length - 1; i >= 0; i--) 
		{
			var piece = pieces[i];
			if(piece instanceof Queen)
				score+=5
			else if(piece instanceof Knight)
				score+=4
			else if(piece instanceof Rook)
				score+=3
			else if(piece instanceof Bishop)
				score+=2
			else if(piece instanceof Pawn)
				score+=1
		}
		return score;

	}
	ScoreMoves(pieces)
	{
		var score = 0;
		for(var i =0;i<pieces.length;i++)
		{
			var piece = pieces[i];
			piece.getMoves(this.ground);
			score+=piece.moves.length;
			score+=3*piece.moves.includes([3,3])+ 2*piece.moves.includes([3,4])+ 2*piece.moves.includes([4,3])+ 2*piece.moves.includes([4,4]);
		}
		return score;

	}
	// performes the move that define the node to generate game grid from parent node's grid
	makeMove(ground)
	{
		
		if (this.move == null)
			return ground;
		else{
			var newGround = ground;
			newGround[this.piece.y][this.piece.x] = null;
			this.piece.old = {x:this.piece.x,y:this.piece.y};
			this.piece.x = this.move[0];
			this.piece.y = this.move[1];
			newGround[this.piece.y][this.piece.x]=this.piece;
			return newGround;
		}
	}
	//generates child nodes (game scenarios) that stem from this move
	getChildren()
	{
		var children = [];

		for (var i = this.filteredPieces.opp.length - 1; i >= 0; i--) {
			var piece = this.filteredPieces.opp[i];
			piece.getMoves(this.ground);
			if (piece.moves.length !=0){
			for (var j = piece.moves.length - 1; j >= 0; j--) {
				var move = piece.moves[j];
				children.push(new Node(piece,this.ground,move,this,this.oppColor,this.depth+1,this.targetdepth));
			}
			}
		}
		return children;
	}
	
}
//The AI algorithm which returns scenraio with the best outcome  assuming opponent plays optimumly 
class MiniMax
{
	constructor(targetdepth)
	{
		this.targetdepth = targetdepth;
	}
	//gets the topmost node from best scenario node returned by DoMiniMax
	getNextMove(ground)
	{
		var playground = copy(ground);
		var filteredPieces={self:[],opp:[]};
		for (var i = playground.length - 1; i >= 0; i--) {
			var row = playground[i];
			filteredPieces.self.push(...row.filter(piece => piece != null && piece.color=='Black'));
			filteredPieces.opp.push(...row.filter(piece => piece != null && piece.color=='White'));
		}
		var FirstNode = new Node(null,playground,null,null,'White',0,this.targetdepth);
		var decision = this.DoMiniMax(true,FirstNode);
		var parent = decision.parent;
		while(true)
		{
			if(parent == null)
				return decision;
			else if(parent.parent == FirstNode)
				return parent
			else
				parent = parent.parent;
		}
	}
	//Performs MiniMax Algorithm 
	DoMiniMax(blackTurn,node)
	{
		if(node.children.length == 0)
		{
			return node;
		}
		var scenario =[]
		for (var i = node.children.length - 1; i >= 0; i--) 
		{
				var curNode = node.children[i];
				scenario.push(this.DoMiniMax(!blackTurn,curNode));
		}
		if(blackTurn)
		{
			
			var maxValue = Math.max.apply(Math,scenario.map(function(o){return o.score}));
			var selectedNode = scenario.find(object => object.score == maxValue);
			return selectedNode;
		}
		else
		{
			var minValue = Math.min.apply(Math,scenario.map(function(o){return o.score}));
			var selectedNode = scenario.find(object => object.score == minValue);
			return selectedNode;
		}
	}
}

