(function(){
	if(!canvasSupport()) return;
	var cvs = document.getElementById("cvs"),
		ctx = cvs.getContext('2d'),
		rAF = (function(){
			return 	window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
					function( callback ){
						window.setTimeout( callback , 1000 / 60 );
					};
		})();
	
	var width = cvs.width = window.innerWidth,
		height = cvs.height = window.innerHeight,
		imgCache = [],
		imgData = [],
		rippleData = [];
	window.onresize = resizeHandler;			
	init();	
	animate();

	function init(){
		var stripeWidth = 25; 
		ctx.fillStyle = "#008888";
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = "#00FF77";
		ctx.save();
		ctx.rotate(-0.25);
		for(var i = 0, count = height/stripeWidth; i < count ; i++){
			ctx.fillRect(-width, i * 2 * stripeWidth, 3 * width, stripeWidth);
		}
		ctx.restore();
		imgData = imgCache = ctx.getImageData(0, 0, width, height);
		for (var i = 0, len = width * height, rippleData = new Array(len); i < len;) 
			rippleData[i++] = 0;
	}

	function animate(){
		ctx.putImageData(imgData, 0, 0);
		rAF(animate);
	}

	function addRipple(px, py){

	}

	function drawImage(){
		for(var i = 0; i < height; i++){
			for(var j = 0; j < width; j++){
				imgData[i][j] =
			}
		}
	}

	function resizeHandler(){
		width = cvs.width = window.innerWidth; 
		height = cvs.height = window.innerHeight;
		init(); 
	}

	function canvasSupport(){
  		return !!document.createElement('canvas').getContext;
	}
})();