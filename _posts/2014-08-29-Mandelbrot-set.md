---
title: The Mandelbrot set in Javascript
tags: []
---

A while back I came across a fun puzzle on
[codegolf.stackexchange.com](http://codegolf.stackexchange.com/questions/23423/mandelbrot-image-in-every-language/24080#24080)
to generate the Mandelbrot set in as few characters as possible. I'm happy with
my javascript entry as an example of how a usually pretty readable language can
be made horrendous! Here's the entry:

~~~js
document.body.appendChild(V=document.createElement('Canvas'));j=(D=(X=V.getContext('2d')).createImageData(Z=V.width=V.height=255,Z)).data;for(x=Z*Z;x--;){k=a=b=c=0;while(a*a+b*b<4&&Z>k++){c=a*a-b*b+4*(x%Z)/Z-3;b=2*a*b+4*x/(Z*Z)-2;a=c;}j[4*x]=99*k%256;j[4*x+3]=Z;}X.putImageData(D,0,0);
~~~

And here's the output:

![The codegolf version](/img/blog/mandelbrot_codegolf.png)

I've indented the code made the variables more verbose, and added some comments:

~~~js
document.body.appendChild(Canvas=document.createElement('Canvas'));
dataArray=(
  imageData=(
    context=Canvas.getContext('2d')
  ).createImageData(
    //save space by making the image size equal to the number of iterations
    Z=Canvas.width=Canvas.height=255,Z
  )
).data;

// Rather than two nested for loops, use one big one, and use
// (x%Z)/Z and x/(Z*Z). Also, decreasing instead of increasing
// means you don't need to specify an end value
for(x=Z*Z;x--;){
  k=a=b=c=0;
  
  // This would also traditionally be a for loop, but this while
  // loop is very terse
  while(
    a*a+b*b<4
    &&Z>k++
  ){
    c=a*a-b*b+4*(x%Z)/Z-3;
    b=2*a*b+4*x/(Z*Z)-2;
    a=c;
  }
  // the quickest way I could find to populate the red channel with a
  // semi-random value
  dataArray[4*x]=99*k%256; 
  dataArray[4*x+3]=Z;
}
context.putImageData(imageData,0,0);
~~~

What I wanted to do is adapt and extend this code a bit, which doesn't really fit
into the code-golf format. I added zooming on the left and right clicks, a few
extra parameters on the generator so that it can generate julia fractals too, and
you can set arbitrary bounds and iterations. I had enough fun playing around with
different parameters that I thought it'd be good to share it - for more in-depth
tweaking, try [this version](http://jsfiddle.net/ali0sha/7Jjex/1/).

<canvas id="mandelbrotCanvas"></canvas>
<script src="/js/mandelbrot.js"></script>

~~~js
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
}

(function init() {

    var recalc = function(evt,elem) {
        cX -= scale*(2*(evt.pageX-elem.offsetLeft)/Canvas.width-1);
        cY -= scale*(2*(evt.pageY-elem.offsetTop)/Canvas.height-1);
    }
    var Canvas = document.createElement('Canvas'),
        iter   = 50,
        limit  = 4,
        cX     = 0,
        cY     = 0,
        scale  = 1.5,
        u = 1,
        v = 0,
        w = 0;
    document.body.appendChild(Canvas);
    Canvas.width=Canvas.height=400;
    generateMandelbrot(Canvas, iter, limit, cX, cY, scale, u, v, w);
    
    Canvas.addEventListener('click',function(e){
        recalc(e,this);
        scale /= 2;
        iter *=1.25;
        generateMandelbrot(
            Canvas, iter, limit, cX, cY, scale, u, v, w
        );
    });
    Canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
        recalc(e, this);
        scale *= 2;
        iter /= 1.25;
        generateMandelbrot(
            Canvas, iter, limit, cX, cY, scale, u, v, w
        );
    });
}());
~~~