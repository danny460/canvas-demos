(function(){
    if(!canvasSupport()) return;
    var cvs = document.getElementById("cvs"),
		ctx = cvs.getContext('2d');
    var width = cvs.width;
    var height = cvs.height;
    var p1,p2,ball;
    init();
    animate();

    function Player(initX){
        this.height = 100;
        this.width = 20;
        this.positionX = initX;
        this.positionY = height/2 - this.height/2;
        this.velocity = 0;
        this.score = 0;
    }

    Player.prototype.move = function(d){
        this.positionX -= 0;
        this.clamp();
    }
    Player.prototype.clamp = function(){
        if(this.positionY < 0) this.positionX = 0;
        else if(this.positionY > height - 50) this.positionX = height - 50;
    }


    function init(){
        p1 = new Player(20)
        p2 = new Player(width-40);
        cvs.tabIndex = 1000;
        cvs.addEventListener("keydown",handleKeyDown);
    }

    function animate(){
        with(ctx){
            beginPath();
            rect(0,0,width,height);
            fillStyle = "#f0f0f0";
            fill();
            beginPath();
            rect(p1.positionX,p1.positionY,p1.width,p1.height);
            fillStyle = "#121212";
            fill();
            beginPath();
            rect(p2.positionX,p2.positionY,p2.width,p2.height);
            fillStyle = "#121212";
            fill();
            beginPath();
            fillText(p1.score,30,30);
            beginPath();
            fillText(p2.score,width-50,30);
        }
        requestAnimationFrame(animate);
    }

    function handleKeyDown(evt){
        var x = evt.which || evt.keycode;
        if(x === 119 )
            p1.move(1);
        else if(x === 115)
            p1.move(-1);    
        else if(x === 38 )
            p2.move(1);
        else if(x === 40)
            p2.move(-1); 
        console.log(x);       
    }

    function canvasSupport(){
  		return !!document.createElement('canvas').getContext;
	}
})();