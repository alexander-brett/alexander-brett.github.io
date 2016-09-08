// Explanatory notes for this file.

// I could have just downloaded the .csv file from data.london.gov.uk and been
// happy, but ultimately I was putting this on my website, and so I was concerned
// about speed and data usage - and CSV is not the most efficient way to do things.

// Additionally, putting the data I cared about in a sqlite database made coping
// with datasets that spanned multiple years much easier, especially since
// querying things with sql.js is very easy indeed.

var databasePromise = loadDatabase("res/london-vis/data.db");

function drawColourKey(elementName, colourer, isleft){
  var base = d3.select(elementName);
  var colkey =  base.selectAll(
    isleft ? "cirle.colour.leftkey" : "circle.colour.key").data(colourer.key);
  colkey.transition().duration(700).style("fill", function(d){return d.colour});
  colkey.exit().remove();
  colkey.enter()
    .append('circle')
    .attr('cx', isleft ? 30 : 600-30)
    .attr('cy', function(d,i){return 20+(40*i)})
    .attr("class",isleft ? "colour leftkey" : "colour key")
    .style("fill", function(d){return d;})
    .attr("r", 10);

  var colcaption = base.selectAll(isleft ? "text.colour.leftkey":"text.colour.key").data(colourer.captions);
  colcaption.text(function(d){return d});
  colcaption.exit().remove();
  colcaption.enter()
    .append('text')
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", isleft ? "start" : "end")
    .attr("class", isleft?"colour leftkey":"colour key")
    .text(function(d){return d;})
    .attr("x", isleft ? 60 : 600 - 60)
    .attr("y", function(d,i){return 20+(40*i)});
}

function colourFromPercentPromise(table, column, caption){
  return databasePromise.then(function(db){
    var query = db.exec("SELECT max("+column+"), min("+column+") FROM "+table+";");
    var [max, min] = query[0].values[0];
    var data = sqlQuery(db, "SELECT id, "+column+" FROM "+table+";");
    var convert = d3.scaleLinear().domain([fix(min),fix(max)]).range([255,0]);
    return function(colourpicker){
      function _colour(value){
        var n = convert(fix(value));
        return typeof(colourpicker) === "function" ? colourpicker(n) : d3.rgb(0,n, n);
      }
      var colourer = function(d){return _colour(data[d.id]);};
      colourer.key = [min, max].map(_colour);
      colourer.captions = [min,max].map(function(d){
        return (fix(d)+caption).replace(/(\d.\d)\d+/, "$1");
      });
      return colourer;
    };
  });
}

function radiusByAxisPromise(column, table, caption){
  return databasePromise.then(function(db){
    var query = db.exec("SELECT max("+column+"), min("+column+") FROM "+table+";");
    var [max, min] = query[0].values[0];
    var data = sqlQuery(db, "SELECT id, "+column+" FROM "+table+" ORDER BY id ASC;");
    var convert = d3.scaleSqrt().domain([0,fix(max)]).range([0,24]);
    var sizer = function(i){
      return convert(fix(data[i.id]))
    };
    sizer.key = [convert(fix(min)), convert(fix(max))];
    sizer.captions = [min + caption, max + caption];
    return sizer;
  });
}

var radiusByAreaPromise = radiusByAxisPromise("area", "area", " sq. km");

var colourByCouncilHousingPromise = colourFromPercentPromise('housing', 'social*100.0/(social + owned + mortgage + private_rent + other)', "% social housing");

var colourByMayorPromise = databasePromise.then(function(db){
  var data = sqlQuery(db, "SELECT id, winner FROM voting");
  var colours = {
    'Sadiq Aman Khan - Labour Party' : d3.rgb(250,15,15),
    'Zac Goldsmith - The Conservative Party': d3.rgb(15,15,250)
  };
  var colourer = function(d){
    return colours[data[d.id]];
  };
  colourer.key = Object.keys(colours).map(function(i){return colours[i]});
  colourer.captions = [
   "Sadiq Aman Khan", "Zac Goldsmith"
  ]
  return colourer;
})

var boroughsPromise = databasePromise.then(function(db){
  var _projection = d3.geoMercator()
    .scale(37000)
    .center([-0.09, 51.5])
    .translate([300,300]);
  var data = [];
  var statement = db.prepare(
    "SELECT * from boroughs " +
    "JOIN locations ON boroughs.id = locations.id " +
    "ORDER BY "+
    "(loCations.lat-($lat))*(locations.lat-($lat))"
    +"+(locations.long-($long))*(locations.long-($long))"
    +" ASC "
    , {$lat: 51.5, $long: -0.09}
  );
  while(statement.step()){
    var item = statement.getAsObject();
    [item.initialX, item.initialY] = [item.x,item.y] = _projection([item.long, item.lat]);
    data.push(item);
  }
  return data;
});

var radiusByPopulationPromise = databasePromise.then(function(db){
  var table = "population", column = "population", caption = " inhabitants";
  var query = db.exec("SELECT max("+column+"), min("+column+") FROM "+table+" WHERE year=2016;");
  var [max, min] = query[0].values[0];
  var data = sqlQuery(db, "SELECT id, "+column+" FROM "+table+" WHERE year=2016 ORDER BY id ASC;");
  var convert = d3.scaleSqrt().domain([0,fix(max)]).range([0,10]);
  var sizer = function(i){
    return convert(fix(data[i.id]))
  };
  sizer.key = [convert(fix(min)), convert(fix(max))];
  sizer.captions = [min + caption, max + caption];
  return sizer;
});
