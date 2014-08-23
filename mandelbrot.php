<html>
    <head>
    </head>
    <body>
        <canvas id='mandelbrot' height="400" width="400"></canvas>
    </body>
    <script type="text/javascript">
        (function () {
              var V = document.getElementById('mandelbrot'), 
                X = V.getContext('2d'), 
                x, y, t, M = Math, N = <?php if(isset($_REQUEST['iter'])){echo $_REQUEST['iter'];} else {echo '64';};?>,
                Z = V.width = V.height = <?php if(isset($_REQUEST['size'])){echo $_REQUEST['size'];} else {echo '200';};?>, 
                P = ['#000'], R = function(){return <?php if(isset($_REQUEST['pretty'])){?>M.round(255*M.random()) <?php } else {?> 0 <?php }; ?> };
            console.log(P);
            for(i=1;i++<N;) P.push("rgba("+R()+','+R()+','+R()+','+M.pow((i/N),4)+')');

            for(x=Z;x--;) for(y=Z;y--;) {
                var k=N, a=b=0,t;
                while (a*a + b*b < 4 && k--) {
                    t = 2*b*a;
                    a = a*a - b*b + 3*x/Z - 2;
                    b = t + 3*y/Z - 1.5
                }
                X.fillStyle = P[k+1];
                X.fillRect(x, y, 1, 1);
            }
            console.log(V.toDataURL('image/png'));
        }());
    </script>
</html>