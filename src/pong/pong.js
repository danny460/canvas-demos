(function(){
	if(!canvasSupport()) return;
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

	Player.prototype.move = move;
	Player.prototype.clamp = clamp;
	Player.prototype.draw = draw;
	Ball.prototype.handleCollision = handleCollision;
	Ball.prototype.hasIntersect = hasIntersect;
	Ball.prototype.move = moveBall;
	Ball.prototype.draw = drawBall;
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
		this.positionX = initX;
		this.positionY = height/2 - this.height/2;
		this.velocity = 0;
		this.score = 0;
	}

	function Ball(){
		this.center = {x: width/2 , y: height/2};
		this.radius = 10;
		this.velocity = {x:0, y:0};
	}
	
	//Player.prototype.move
	function move(){
		this.positionY += this.velocity * elapsedSinceLastLoop;
		this.clamp();
	}
	//Player.prototype.clamp
	function clamp(){
		if(this.positionY < 0) 
			this.positionY = 0;
		else if(this.positionY > height - this.height) 
			this.positionY = height - this.height;
	}
	//Player.prototype.draw
	function draw(ctx){
		ctx.beginPath();
		ctx.rect(this.positionX, this.positionY,this.width,this.height);
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
			if(this.hasIntersect(p1)){
				//todo
			}
			/*p2*/
			else if(this.hasIntersect(p2)){
				//todo
			}
		}
	}

	function hasIntersect(player){
		return this.center.x > player.positionX - this.radius 
			&& this.center.x < player.positionX + player.width + this.radius
			&& this.center.y > player.positionY - this.radius
			&& this.center.y < player.positionY + player.height + this.radius;
	}

	//Ball.move
	function moveBall(){
		this.center.x += this.velocity.x * elapsedSinceLastLoop;
		this.center.y += this.velocity.y * elapsedSinceLastLoop;
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
		//todo
		setTimeout(function(){
			newGame();
		},10000);
	}

	function newRound(player){
		game.isStarted = true;
		var velocityX = 0.2;
		var toRight = player ? (player.positionX - width/2) > 0 : Math.random() >= 0.5;
		ball = new Ball();
		ball.velocity.x = toRight ? velocityX : -velocityX;
	}


	function canvasSupport(){
		return !!document.createElement("canvas").getContext;
	}

})();