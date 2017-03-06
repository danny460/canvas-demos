(function(){
	if(!canvasSupport()) return;
	Player.prototype.move = move;
	Player.prototype.clamp = clamp;
	Player.prototype.draw = draw;
	Ball.prototype.handleCollision = handleCollision;
	Ball.prototype.hasIntersect = hasIntersect;
	Ball.prototype.checkLineIntersection = checkLineIntersection;
	Ball.prototype.move = moveBall;
	Ball.prototype.draw = drawBall;
	Vector2.prototype.add = add;
	Vector2.prototype.sub = sub;
	Vector2.prototype.multiply = multiply;
	Vector2.prototype.normalize = normalize;
	Vector2.prototype.length = length;

	var cvs = document.getElementById("cvs");
	var	ctx = cvs.getContext("2d");
	var width = cvs.width;
	var height = cvs.height;
	var p1 = new Player(20);
	var p2 = new Player(width-40);
	var ball = new Ball();
	var game;
	var lastTime;
	var elapsedSinceLastLoop;
	cvs.tabIndex = 1000;
	var keyMap = {};
	window.onkeydown = window.onkeyup = function(evt){
		evt = evt || window.event;
		keyMap[evt.keyCode] = evt.type == "keydown";
	};

	newGame();
	animate(new Date().getTime(), ctx, p1, p2);

	function Game(){
		this.isStarted = true;
		this.hasWon = false;
		this.winner = null;
	}

	function Player(initX){
		this.height = 100;
		this.width = 20;
		this.position = new Vector2(initX, height/2 - this.height/2);
		this.velocity = 0;
		this.score = 0;
	}

	function Ball(){
		this.center = new Vector2(width/2, height/2);
		this.velocity = new Vector2(0, 0);
		this.radius = 10;
	}

	function Vector2(x, y){
		this.x = x;
		this.y = y;
	}

	function add(vector){
		return new Vector2(this.x + vector.x , this.y + vector.y);
	}

	function sub(vector){
		return new Vector2(this.x - vector.x , this.y - vector.y);
	}

	function multiply(factor){
		return new Vector2(this.x * factor, this.y * factor);
	}

	function normalize(){
		var factor = 1. / this.length();
		this.x *= factor;
		this.y *= factor;
	}
	
	function length(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	//Player.prototype.move
	function move(){
		this.position.y += this.velocity * elapsedSinceLastLoop;
		this.clamp();
	}
	//Player.prototype.clamp
	function clamp(){
		if(this.position.y < 0) 
			this.position.y = 0;
		else if(this.position.y > height - this.height) 
			this.position.y = height - this.height;
	}
	//Player.prototype.draw
	function draw(ctx){
		ctx.beginPath();
		ctx.rect(this.position.x, this.position.y,this.width,this.height);
		ctx.fillStyle = "#f0f0f0";
		ctx.fill();
		ctx.closePath();
	}

	//Ball.handleCollision
	function handleCollision(p1, p2, width, height){
		if(game.isStarted){
			/*left*/
			if(this.center.x <= this.radius){
				p2.score+=1;
				game.isStarted = false;
				setTimeout(function(){
					newRound(p1);
				}, 1500);
			}
			/*right*/
			else if(this.center.x >= width - this.radius){
				p1.score+=1;
				game.isStarted = false;
				setTimeout(function(){
					newRound(p2);
				}, 1500);
			}
			/*top*/
			if(this.center.y <= this.radius){
				console.log("top");
				//todo
			}
			/*bottom*/
			else if(this.center.y >= height - this.radius){
				console.log("bottom");
				//todo
			}

			/**collision with player**/
			/*p1*/
			var intersection = this.hasIntersect(p1);
			if(intersection !== null){
				//todo
				console.log("p1");
			}
			/*p2*/
			else{
				intersection = this.hasIntersect(p2);
				if(intersection !== null){
					console.log("p2");
				}else{
					console.log("no hit");
				}
				//todo
			}
		}
	}

	//check circle - rectangle intersection
	function hasIntersect(player){
		console.log(player.position.x);
		var intersection = null;
		var height = new Vector2(0, player.height);
		var width = new Vector2(player.width, 0);
		var vertices = [];
		var index = 0;
		var length = 4;
		vertices.push(player.position);
		vertices.push(vertices[0].add(width));
		vertices.push(vertices[1].add(height));
		vertices.push(vertices[2].sub(width));
		while(intersection==null && index !== length){
			if(index == 3){
				console.log(index+1, vertices[index], vertices[0]);
				intersection = this.checkLineIntersection(vertices[index], vertices[0]);
			}
			else{
				console.log(index+1, vertices[index], vertices[index+1]);
				intersection = this.checkLineIntersection(vertices[index], vertices[index+1]);
			}
			console.log("result:", intersection);
			index++;
		}
		return intersection;
	}

	function checkLineIntersection(lineStart, lineEnd){
		var isVertical = lineStart.sub(lineEnd).x === 0;
		var distanceFromStart = this.center.sub(lineStart);
		var length = lineEnd.sub(lineStart).length();
		var distance, adjacent;
		if(isVertical){
			distance = distanceFromStart.x;
			adjacent = distanceFromStart.y;
		}else{
			distance = distanceFromStart.y;
			adjacent = distanceFromStart.x;
		}
		if(distance <= this.radius){
			if(length < Math.abs(adjacent))
				return null;
			else{
				var offset = Math.sqrt(this.radius * this.radius - distance * distance);
				var offsetVector = isVertical ? new Vector2(distance, offset) : new Vector2(offset, distance);
				
				return this.center.add(offsetVector);
			}	
		}else
			return null;
	}

	//Ball.move
	function moveBall(){
		this.center = this.center.add(this.velocity.multiply(elapsedSinceLastLoop));
	}
	//Ball.draw
	function drawBall(ctx){
		ctx.beginPath();
		ctx.fillStyle = "f0f0f0";
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}

	function handlePlayerMove(p1, p2){
		var velocity = 0.1;
		if(keyMap["83"])
			p1.velocity = velocity;
		else if(keyMap["87"])
			p1.velocity = -velocity;
		else
			p1.velocity = 0;	
		if(keyMap["40"])
			p2.velocity = velocity;
		else if(keyMap["38"])
			p2.velocity = -velocity;
		else
			p2.velocity = 0;
		p1.move();					
		p2.move();
	}

	function drawBoard(ctx, p1 ,p2){
		var upperbound = 40;
		ctx.beginPath();
		ctx.rect(0,0,width,height);
		ctx.fillStyle = "#1f1f1f";
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.font = "20px arcade";
		ctx.fillStyle = "#f0f0f0";
		ctx.fillText(p1.score,width/2 - 60, upperbound);
		ctx.fillText("-",width/2 - 10, upperbound);
		ctx.fillText(p2.score,width/2 + 40,upperbound);
		ctx.closePath();
	}
	
	function animate(currentTime, ctx, p1, p2){
		if(!lastTime)
			lastTime = currentTime;
		elapsedSinceLastLoop = currentTime - lastTime;
		lastTime = currentTime;
		ball.handleCollision(p1 , p2, width, height);
		drawBoard(ctx, p1, p2);
		ball.draw(ctx);
		p1.draw(ctx);
		p2.draw(ctx);
		handlePlayerMove(p1, p2);
		ball.move();
		requestAnimationFrame(function(){
			animate(new Date().getTime(), ctx, p1, p2);
		});
	}

	function newGame(){
		game = new Game();
		newRound();
	}

	function restart(){
		setTimeout(function(){
			newGame();
		},10000);
	}

	function newRound(player){
		game.isStarted = true;
		var velocityX = 0.5;
		var toRight = player ? (player.position.x - width/2) > 0 : Math.random() >= 0.5;
		ball = new Ball();
		ball.velocity.x = toRight ? velocityX : -velocityX;
	}


	function canvasSupport(){
		return !!document.createElement("canvas").getContext;
	}

})();