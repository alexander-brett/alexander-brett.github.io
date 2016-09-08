function HexGrid(size, numberOfElements){
  var _self = this;
  var origin = {x: size/2, y: size/2};

  var sideLength = 0;
  while (getAt(++sideLength, 0, 0) < 2*numberOfElements+1){}

  this.gridSpacing = size / (2*sideLength+1);

  this.cells = [{x:origin.x, y:origin.y, hexId:0, neighbours: [1,2,3,4,5,6]}];

  // populate the grid
  for (var ring = 1; ring < sideLength+1; ring++){
    for (var side = 0; side < 6; side++){
      for (var offset = 0; offset < ring; offset++){
        _self.cells.push({
          x: origin.x + this.gridSpacing*(ring*Math.cos(-side*Math.PI/3) + offset * Math.cos((side+2)*Math.PI/3)),
          y: origin.y + this.gridSpacing*(ring*Math.sin(side*Math.PI/3) + offset * Math.sin((side+2)*Math.PI/3)),
          hexId: _self.cells.length,
          neighbours: getAdjacent(ring, side, offset)
        });
      }
    }
  }

  // A list of indices which are the current boundary.
  var boundary = new Set([0]);

  this.boundaryCells = function(){
    return [...boundary].map(function(b){return _self.cells[b];});
  }

  function sqdist(a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  };

  function theta(p){
    if (p.x === origin.x ) return (p.y < 0 ? -1 : 1 )*Math.PI/2;
    return (p.x-origin.x < 0 ? Math.PI : 0 ) + Math.atan((p.y-origin.y)/(p.x-origin.x))
  };

  // Not actually a norm.
  function norm(a, b){
    var dr = Math.abs(sqdist(origin, a) + sqdist(origin,b))/origin.x;
    var dtheta = Math.abs(theta(a) - theta(b)) % 2*Math.PI;
    return dtheta > Math.PI/2
      ? 999999
      // these are hand-tuned coeffs for aesthetics
      : Math.pow(dr, 1)*Math.pow(dtheta, 0.5)*Math.pow(sqdist(a,b)/origin.x,2);
  };

  this.brokenOccupyNearest = function(p){
    var minDist = 1000000, result;
    _self.cells.filter(function(c){return c.occupied != true})
      .forEach(function(cell){
        var d = norm(p, cell);
        if (d < minDist){
          minDist = d;
          result = cell;
        }
      });
    result.occupied = true;
    p.screenX = result.x;
    p.screenY = result.y;
  }

  this.occupyNearest = function(p) {
    var minDist = 1000000, candidate;
    boundary.forEach(function(b){
      var d = norm(p, _self.cells[b]);
      if(d < minDist) {
        minDist = d;
        candidate = b;
      }
    });
    var result = _self.cells[candidate];
    result.occupied = true;
    boundary.delete(candidate);
    result.neighbours.filter(function(b){
        return !boundary.has(b) && b < _self.cells.length && _self.cells[b].occupied != true
    }).forEach(function(b){boundary.add(b);});
    p.screenX = result.x;
    p.screenY = result.y;
    p.hexId = result.hexId;
    p.neighbours = result.neighbours;
  };

  return this;
};
