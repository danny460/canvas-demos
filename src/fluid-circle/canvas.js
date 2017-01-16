window.onload = canvasApp();
window.requestAnimFrame = (function(){})();



function canvasSupport(){
  return !!document.createElement('canvas').getContext;
}
function canvasApp(){
  if(!canvasSupport()) return;
  var cvs = document.getElementById('cvs'),
      ctx = cvs.getContext('2d'),
      ctr = {x: cvs.width/2, y: cvs.height/2},
      radius = 20,
      amplitude = 5,
      sineCount = 10,
      offset = 0;
  redraw();

  function redraw(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      ctx.beginPath();
      for(var i = 0; i < 360; i++){
        var angle = i * Math.PI / 180,
            p = getPoint(ctr, radius, amplitude, angle, sineCount, offset);
        ctx.lineTo(p.x, p.y);    
      }
      ctx.closePath();
      ctx.stroke();
      offset++;
      requestAnimationFrame(redraw);
  }

  function getPoint(ctr, radius, amplitude, angle, sineCount, offset){
    var offsetAngle = angle + offset * Math.PI / 180;
    if(offsetAngle > 2 * Math.PI){
      offsetAngle -= 2 * Math.PI;
    }
    var x = ctr.x + (radius + amplitude * Math.sin(sineCount * angle)) * Math.cos(offsetAngle),
        y = ctr.y + (radius + amplitude * Math.sin(sineCount * angle)) * Math.sin(offsetAngle);
    return { x:x, y:y};
  }
}
