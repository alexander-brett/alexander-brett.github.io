var slideshow = remark.create({
  navigation: {
    scroll: false,
    touch: true,
    click: false
  }
});

var geographyPromise = loadUrl("res/london-geomob-presentation/wards_simplified.topojson", "json")
  .then(function(data){
    return topojson.feature(data, data.objects.wards).features
  });


var boroughs = {}, i = 0, palette = d3.scaleOrdinal(d3.schemeCategory20);
function colourByBorough(d){
    if(boroughs[d.borough] === undefined){ boroughs[d.borough] = i++%20; }
    return palette(boroughs[d.borough]);
};

var projection = d3.geoMercator()
  .scale(35000)
  .center([-0.09, 51.5])
  .translate([300,300]);

function makeGrid(data){
    var grid = new HexGrid(600, 630);
    data.forEach(grid.occupyNearest);
    return grid;
};

var hidden = {}, hideFunctions = {};
var tapped = {}, tapFunctions = {};
var loaded = {}, loadFunctions = {
  "chloropleth-example-outline": function(){
    geographyPromise.then(function(geography){
      d3.select("#chloropleth-example-outline")
      .selectAll("path")
      .data(geography)
      .enter().append("path")
      .attr("d", d3.geoPath().projection(projection))
      .attr("class", "wards-outline");
    });
  },
  "chloropleth-example-coloured": function(name){
    return geographyPromise.then(function(geography){
      var boroughs = {}, i = 0, palette = d3.scaleOrdinal(d3.schemeCategory20);
      return d3.select(name || "#chloropleth-example-coloured")
      .selectAll("path")
      .data(geography)
      .enter().append("path")
      .attr("d", d3.geoPath().projection(projection))
      .style("fill", function(d){
        if(boroughs[d.properties.BOROUGH] === undefined){ boroughs[d.properties.BOROUGH] = i++%20; }
        return palette(boroughs[d.properties.BOROUGH]);
      });
    });
  },
  "chloropleth-example-transition": function(){
    Promise.all([
      loadFunctions["chloropleth-example-coloured"]("#chloropleth-example-transition"),
      colourByCouncilHousingPromise
    ]).then(function(args){
      var [nodes, fn] = args;
      var colourer = fn();
      tapFunctions["chloropleth-example-transition"] = [function(){
        nodes.transition().duration(1500).style("fill", colourer);
        drawColourKey("#chloropleth-example-transition", colourer, true);
      }];
    });
  },
  "hexgrid-naughty": function(){
    return boroughsPromise.then(function(data){
      var grid = new HexGrid(600, 630);
      data.forEach(grid.brokenOccupyNearest);
      return d3.select("#hexgrid-naughty").selectAll('polygon')
        .data(data)
        .enter().append('polygon')
        .attr('points', '0,1 0.866,0.5 0.866,-0.5 0,-1 -0.866,-0.5 -0.866,0.5')
        .style('fill', colourByBorough)
        .attr('transform', function(d){
          return 'translate('+d.screenX+','+d.screenY+') scale('+(grid.gridSpacing/Math.sqrt(3)-0.1)+')';
        });
    });
  },
  "hexgrid-algorithm": function(name){
    boroughsPromise.then(function(data){
      var grid = new HexGrid(600, 630);
      d3.select("#Hexgrid-algorithm").selectAll("polygon").data(grid.cells)
        .enter().append('polygon')
        .attr('points', '0,1 0.866,0.5 0.866,-0.5 0,-1 -0.866,-0.5 -0.866,0.5')
        .style('fill', 'none').attr('transform', function(d){
          return 'translate('+d.x+','+d.y+') scale('+(grid.gridSpacing/Math.sqrt(3)-0.1)+')';
        });
      var dataIndex = 0;
      var nextPoint = d3.select("#Hexgrid-algorithm").append('circle');
      var iterate = function(){
        grid.occupyNearest(data[dataIndex]);
        nextPoint.datum(data[dataIndex])
          .attr('cx', function(d){return d.x})
          .attr('cy', function(d){return d.y})
          .attr('r', 3)
          .style('fill', 'red');
        d3.select("#Hexgrid-algorithm")
          .selectAll("polygon")
          .data(grid.boundaryCells(), function(d){return d.hexId})
          .style('fill', 'rgba(0,0,0,0.2)');
        d3.select("#Hexgrid-algorithm")
          .selectAll("polygon")
          .data([data[dataIndex]], function(d){return d.hexId})
          .style('fill', colourByBorough);
        d3.select("#Hexgrid-algorithm").append('line').datum(data[dataIndex])
          .attr('x1', function(d){return d.x;})
          .attr('y1', function(d){return d.y;})
          .attr('y2', function(d){return d.screenY;})
          .attr('x2', function(d){return d.screenX;})
          .style('stroke', 'black')
          .style('stroke-width', '1');

        dataIndex++;
        if (dataIndex < 25) tapFunctions["hexgrid-algorithm"].push(iterate);
      };
      tapFunctions["hexgrid-algorithm"] = [];
      iterate();
    });
  },
  "hexgrid-transition": function(){
    Promise.all([
      boroughsPromise,
      colourByCouncilHousingPromise
    ]).then(function(args){
      var [data, fn] = args;
      var grid = makeGrid(data);
      var nodes = d3.select("#Hexgrid-transition").selectAll('polygon')
        .data(data)
        .enter().append('polygon')
        .attr('points', '0,1 0.866,0.5 0.866,-0.5 0,-1 -0.866,-0.5 -0.866,0.5')
        .style('fill',  colourByBorough)
        .attr('transform', function(d){
          return 'translate('+d.screenX+','+d.screenY+') scale('+(grid.gridSpacing/Math.sqrt(3))+')';
        });
      tapFunctions["hexgrid-transition"] = [function(){
        var colourer = fn(function(n){return d3.rgb(n,n,n);})
        d3.select("#Hexgrid-transition").selectAll('polygon.second')
         .data(data)
         .enter().append('polygon')
         .attr('class', 'second')
         .attr('points', '0,1 0.866,0.5 0.866,-0.5 0,-1 -0.866,-0.5 -0.866,0.5')
         .style('fill', colourer)
         .attr('transform', function(d){
           return 'translate('+d.screenX+','+d.screenY+') scale(0)';
         }).transition().duration(1000).attr('transform', function(d){
           return 'translate('+d.screenX+','+d.screenY+') scale(5.4)';
         });
        drawColourKey("#Hexgrid-transition", colourer, true)
      },
      function(){
        colourByMayorPromise.then(function(mayorFn){
          nodes.transition().duration(1000)
            .style('fill', mayorFn);
          drawColourKey("#Hexgrid-transition", mayorFn)
        });
      }];
    });
  },
  'bubbles-animated': function(){
    Promise.all([boroughsPromise, radiusByAreaPromise]).then(function(args){
      var [data, areaFn] = args;
      //because mutation
      data = data.map(function(d){return Object.assign({}, d)});
      var nodes = d3.select("#bubbles-animated").selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', function(d){return d.initialX;})
       .attr('cy', function(d){return d.initialY;})
       .attr('r', areaFn)
       .style('fill', colourByBorough);
      var force;
      var collisionForce = d3.forceCollide(areaFn);
      tapFunctions['bubbles-animated'] = [
        function(){
          force = d3.forceSimulation(data)
            .force("collision", collisionForce);
          force.on('tick', function(){
            nodes
            .attr('cx', function(d){return d.x;})
            .attr('cy', function(d){return d.y;});
          });
          hideFunctions['bubbles-animated'] = force.stop;
        },
        function(){
          radiusByPopulationPromise.then(function(popFn){
            nodes.attr('r', popFn);
            collisionForce.radius(popFn)
              .initialize(force.nodes());
            force.alpha(1).restart();
          });
        }
      ];
    });
  },
  'bubbles-animated-better': function(){
    Promise.all([boroughsPromise, radiusByAreaPromise]).then(function(args){
      var [data, areaFn] = args;
      data = data.map(function(d){return Object.assign({}, d)});
      var nodes = d3.select("#bubbles-animated-better").selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', function(d){return d.initialX;})
       .attr('cy', function(d){return d.initialY;})
       .attr('r', areaFn)
       .style('fill', colourByBorough);
     var radiusForce = d3.forceCollide(areaFn);
     var force = d3.forceSimulation(data)
         .force("collision", radiusForce)
         .force("centerx", d3.forceX(function(d){return d.initialX;}))
         .force("centerx", d3.forceY(function(d){return d.initialY;}))
         .force("charge", d3.forceManyBody().strength(-0.08));
       force.on('tick', function(){
         nodes
           .attr('cx', function(d){return d.x;})
           .attr('cy', function(d){return d.y;});
       });
      tapFunctions['bubbles-animated-better'] = [
        function(){
          radiusByPopulationPromise.then(function(popFn){
            nodes.attr('r', popFn);
            radiusForce.radius(popFn)
              .initialize(force.nodes());
            force.alpha(1).restart();
          });
        }
      ];
      hideFunctions['bubbles-animated-better'] = force.stop;
    });
  },
}
function load(slide){
  if (slide === undefined) slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
  if (loadFunctions[slide.properties.name] && !loaded[slide.properties.name]){
    loaded[slide.properties.name] = true;
    loadFunctions[slide.properties.name]();
    return true;
  }
  return false;
}

function step(){
    var slide = slideshow.getSlides()[slideshow.getCurrentSlideIndex()];
    if (load()) return true;
    if (tapped[slide.properties.name] === undefined) tapped[slide.properties.name] = 0;
    if (!!tapFunctions[slide.properties.name] && tapped[slide.properties.name] < tapFunctions[slide.properties.name].length){
      tapFunctions[slide.properties.name][tapped[slide.properties.name]++]();
      return true;
    }
    return false;
  }

// handle slideshow navigation
document.onmousedown = function(e){
  if (e.button == 0){
    // the idea here is that clicking will step while possible, then jump
    step() || slideshow.gotoNextSlide();
  } else {
    // but sometimes we might need a short-circuit
    slideshow.gotoNextSlide();
  }
  e.preventDefault(true);
  return false;
};
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

slideshow.on('hideSlide', function(slide){
  if (hideFunctions[slide.properties.name] && !hidden[slide.properties.name]){
    hidden[slide.properties.name] = true;
    hideFunctions[slide.properties.name]();
  }
});
slideshow.on('showSlide', load);
slideshow.on('tappedSlide', step);
