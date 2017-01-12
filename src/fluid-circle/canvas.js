window.onload = canvasApp();
window.requestAnimFrame = (function(){})();



function canvasSupport(){
  return !!document.createElement('canvas').getContext;
}
function canvasApp(){
  if(!canvasSupport()) return;
  var cvs = document.getElementById('cvs'),
      ctx = cvs.getContext('2d');
  redraw();

  function redraw(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      //todo
      requestAnimationFrame(redraw);
  }



}
