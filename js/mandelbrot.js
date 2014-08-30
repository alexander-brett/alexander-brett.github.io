//Advanced mandelbrot with clicks
var generateMandelbrot = function (
  Canvas, iterations, limit, cX, cY, scale, u, w, z
) {
  dataArray=(
    imageData=(
      context=Canvas.getContext('2d')
    ).createImageData(Z=Canvas.width, Z)
  ).data;
  for (i=Z*Z;i--;) {
    var k = c = 0,
      a = x = scale*(2*(i%Z)/Z-1) - cX,
      b = y = scale*(2*i/(Z*Z)-1) - cY;
    while (a*a+b*b < limit && iterations > k++ ) {
      c=a*a-b*b+u*x+w;
      b=2*a*b+u*y+z;
      a=c;
    }
    dataArray[4*i+3]=k*255/iterations;
  }
  context.putImageData(imageData,0,0);
  console.log(Canvas.toDataURL());
};

(function init() {
  var Canvas = document.getElementById('mandelbrotCanvas'),
    iter   = 50,
    limit  = 4,
    cX     = 0,
    cY     = 0,
    scale  = 1.5,
    u = 1,
    v = 0,
    w = 0;

  var recalc = function(evt,elem) {
    console.log(evt.pageY-elem.offsetTop + $('#blog').offset().top);
    cX -= scale*(2*(evt.pageX-elem.offsetLeft + $('#blog').scrollLeft() - $('#blog').offset().left)/Canvas.width-1);
    cY -= scale*(2*(evt.pageY - elem.offsetTop + $('#blog').scrollTop() - $('#blog').offset().top)/Canvas.height-1);
    
    console.log(cX, cY);
  }
  
  Canvas.width=Canvas.height=400;
  generateMandelbrot(Canvas, iter, limit, cX, cY, scale, u, v, w);
  Canvas.addEventListener('click',function(e){
    recalc(e,this);
    scale /= 2;
    iter *=1.25;
    generateMandelbrot(Canvas, iter, limit, cX, cY, scale, u, v, w);
  });
  Canvas.addEventListener('contextmenu', function(e){
    e.preventDefault();
    recalc(e, this);
    scale *= 2;
    iter /= 1.25;
    generateMandelbrot(Canvas, iter, limit, cX, cY, scale, u, v, w);
  });
}());