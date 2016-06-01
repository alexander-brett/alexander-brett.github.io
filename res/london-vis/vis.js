function londonvis () {

  d3.select('#london-vis .overlay').remove();

  var scale = 4;
  var width = 180 * scale;
  var height = 160 * scale;
  var svg = d3.select("#london-vis svg")
    .attr("width", width)
    .attr("height", height);

  function makeOptions(database){

    var options = this;

    function radiusFromProperty(table, column, label, size, sourceInfo){
      var result = function(db){
        var query = db.exec(
          "SELECT max("+column+"), min("+column+") FROM "+table+";"
          + "SELECT "+column+" FROM "+table+" ORDER BY id ASC;"
        );
        var values = query[1].values.map(function(d){return d[0]});
        var min = query[0].values[0][1];
        var max = query[0].values[0][0];
        var convert = d3.scale.sqrt().domain([0,fix(max)]).range([0,size*scale]);
        this.caption = function(i){return values[i] + label};
        this.radius = function(i){
          return convert(fix(values[i]))
        };
        this.key = [{
          caption: min + label,
          radius: convert(fix(min))
        },{
          caption: max + label,
          radius: convert(fix(max))
        }];
        return this;
      }
      result.sourceInfo = sourceInfo;
      return result;
    }

    function radiusWithYears(table, column, size, db, sourceInfo){
      var query = db.exec("SELECT DISTINCT year FROM "+table+" ORDER BY year DESC");
      var availableYears =  query[0].values.map(function(d){ return d[0]});
      function doMakeRadius(){
         var query = db.exec(
          "SELECT max("+column+"), min("+column+") FROM "+table+";"
          + "SELECT "+column+" FROM "+table+" WHERE year="+doMakeRadius.year+" ORDER BY id ASC;"
        );
        var values = query[1].values.map(function(d){return d[0]});
        var min = query[0].values[0][1];
        var max = query[0].values[0][0];
        var convert = d3.scale.sqrt().domain([0,fix(max)]).range([0,size*scale]);
        this.caption = function(i){return values[i]};
        this.radius = function(i){
          return convert(fix(values[i]))
        };
        this.key = [{
          caption: min,
          radius: convert(fix(min))
        },{
          caption: max,
          radius: convert(fix(max))
        }];
        return this;
      }

      doMakeRadius.sourceInfo = sourceInfo;
      doMakeRadius.years = availableYears.map(function(d){
        return {value:d, action: function(){
          doMakeRadius.year = d
          }}
      });
      doMakeRadius.year = availableYears.filter(function(y){return y<=2016})[0];
      return doMakeRadius;
    }

    var radiusMap = {
        //"Number of jobs in area - 2013": radiusFromPropertySqrt('Jobs', 'Jobs', 7),
        //"In employment (16-64) - 2011": radiusFromPropertyLinear('Employed', 'Employed', 3.2),
        "Area (sq. km)": radiusFromProperty("area", "area", "sq. km", 6.2, "Area calculated by GLA using GIS boundary files from Ordnance Survey"),
        "Mayoral election 2016 total turnout size": radiusFromProperty("voting", "turnout", " voters", 2.5, "<a href='http://data.london.gov.uk/elections'>London Elects</a>"),
        "Mayoral election 2016 registered voters": radiusFromProperty("voting", "electorate", " voters", 2.2, "<a href='http://data.london.gov.uk/elections'>London Elects</a>"),
        "Population estimates & projections": radiusWithYears("population", "population", 3.2, database, "<a href='http://data.london.gov.uk/datastore/applications/custom-age-tool-gla-population-projections-ward'>GLA SHLAA Trend based Population Projection data, released in March 2013.</a>"),
        "Median House Price (£)": radiusWithYears('median_house_price', 'price', 3.7, database, "The Land Registry publish full postcode price paid data on their website. Using this data, the GLA have calculated approximate average house prices."),
      };

    var sizeInputs = d3.select('#london-vis').append('fieldset').attr('id', 'sizeInput');
    sizeInputs.append('legend').text('Size');
    makeOptionsRadioButtons(sizeInputs, radiusMap, 'sizeOption', 'radius year');

    this.makeRadius = function(db){
      return radiusMap[d3.select('input[name=sizeOption]:checked').node().value](db)
    }

    var colourFromBorough = function(){
      return function(db){
        var boroughQuery = db.exec(
          "SELECT DISTINCT borough FROM boroughs;"
         + "SELECT borough FROM boroughs ORDER BY id ASC");
        var boroughs = boroughQuery[0].values.map(function(d){return d[0]});
        var values = boroughQuery[1].values.map(function(d){return boroughs.indexOf(d[0])});
        var palette = d3.scale.category20();
        this.caption = function(i){return boroughs[values[i]]};
        this.colour = function(i){return palette(values[i]%20)};
        this.key = [];
        return this;
      }
    }

    var colourFromMayor = function(){
      return function(db){
        var mayorQuery = db.exec(
          "SELECT winner FROM voting ORDER BY id ASC");
        var values = mayorQuery[0].values.map(function(d){return d[0]});
        var sadiq = d3.rgb(250,15,15);
        var zac = d3.rgb(15,15,250);
        var colours = {'Sadiq Aman Khan - Labour Party' : sadiq, 'Zac Goldsmith - The Conservative Party': zac};
        this.caption = function(i){return values[i]};
        this.colour = function(i){return colours[values[i]]};
        this.key = [{
          caption:'Zac Goldsmith - The Conservative Party',
          colour: zac
        },{
          caption: 'Sadiq Aman Khan - Labour Party',
          colour: sadiq
        }];
        return this;
      }
    }

     function colourWithYears(table, column, size, db, sourceInfo){
      var query = db.exec("SELECT DISTINCT year FROM "+table+" ORDER BY year DESC");
      var availableYears =  query[0].values.map(function(d){ return d[0]});
      function doMakeRadius(){
         var query = db.exec(
          "SELECT max("+column+"), min("+column+") FROM "+table+";"
          + "SELECT "+column+" FROM "+table+" WHERE year="+doMakeRadius.year+" ORDER BY id ASC;"
        );
        var values = query[1].values.map(function(d){return d[0]});
        var min = query[0].values[0][1];
        var max = query[0].values[0][0];
        var convert = d3.scale.sqrt().domain([fix(min),fix(max)]).range([230,20]);
        function makeColour (value){
          var n = convert(fix(value));
          return d3.rgb(n,255-n, n);
        }
        this.caption = function(i){return values[i]};
        this.colour = function(i){
          return makeColour(values[i])
        };
        this.key = [{
          caption: min,
          colour: makeColour(min)
        },{
          caption: max,
          colour: makeColour(max)
        }];
        return this;
      }
      doMakeRadius.sourceInfo = sourceInfo;
      doMakeRadius.years = availableYears.map(function(d){
        return {value:d, action: function(){
          doMakeRadius.year = d
          }}
      });
      doMakeRadius.year = availableYears.filter(function(y){return y<=2016})[0];
      return doMakeRadius;
    }

    function colourFromGenericPercent(table, column, sourceInfo){
      var result =  function(db){
        var query = db.exec(
          "SELECT max("+column+"), min("+column+") FROM "+table+";"
          + "SELECT "+column+" FROM "+table+" ORDER BY id ASC;"
        );
        var values = query[1].values.map(function(d){return d[0]});
        var min = query[0].values[0][1];
        var max = query[0].values[0][0];
        var convert = d3.scale.linear().domain([fix(min),fix(max)]).range([230,20]);
        function makeColour (value){
          var n = convert(fix(value));
          return d3.rgb(0,n, n);
        }
        this.caption = function(i){return values[i]};
        this.colour = function(i){
          return makeColour(values[i])
        };
        this.key = [{
          caption: min,
          colour: makeColour(min)
        },{
          caption: max,
          colour: makeColour(max)
        }];
        return this;
      }
      result.sourceInfo = sourceInfo;
      return result;
    }

    var colourMap = {
        //"% Households Social Rented - 2011": colourFromGenericPercent('Social housing', 'Social_house_percent'),
        //"% BAME - 2011": colourFromGenericPercent('BAME Population', 'BAME_percent'),
        //"Employment rate (16-64) - 2011": colourFromGenericPercent('Employment rate', 'Employment_rate'),
        //"% Flat, maisonette or apartment - 2011": colourFromGenericPercent('Apartments', 'Apartment_percent'),
        //'Claimant rate of key out-of-work benefits (working age client group) (2014)': colourFromGenericPercent('OOW Benefits Recipients', 'Out_of_work_benefints_percent'),
        "Borough": colourFromBorough(),
        "Proportion of social rented housing": colourWithYears(
          'housing',
          'social*100.0/(social + owned + mortgage + private_rent + other)',
          4,
          database,
          "Census data"
        ),
        "Mayoral election 2016 result": colourFromMayor("<a href='http://data.london.gov.uk/elections'>London Elects</a>"),
        "Mayoral election 2016 percentage turnout": colourFromGenericPercent('voting', 'percent_turnout', "<a href='http://data.london.gov.uk/elections'>London Elects</a>"),
        "Population density (with projections)": colourWithYears('population_density', 'density', 4, database,
          "<a href='http://data.london.gov.uk/datastore/applications/custom-age-tool-gla-population-projections-ward'>GLA SHLAA Trend based Population Projection data, released in March 2013.</a>")
      };

    this.makeColour = function(db){
      return colourMap[d3.select('input[name=colourOption]:checked').node().value](db)
    }

    var colourInput = d3.select('#london-vis').append('fieldset').attr('id', 'colourInput');
    colourInput.append('legend').text('Colour');
    makeOptionsRadioButtons(colourInput, colourMap, 'colourOption', 'colour year');
    return this;
  }

  function position(alpha){
    return function(datum){
      var desired = datum.desiredLocation;
      var x = desired[0] - datum.x;
      var y = desired[1] - datum.y;
      var force = 0.008*datum.radius*Math.sqrt(x*x + y*y);
      datum.x += alpha*x*force;
      datum.y += alpha*y*force;
    }
  }

  function collide(nodes, alpha) {
    return function(node1) {
      nodes.each(function(node2) {
        if(node1 != node2) {
          var x = node1.x - node2.x;
          var y = node1.y - node2.y;
          var distance = Math.sqrt(x * x + y * y);
          var minDistance = node1.radius + node2.radius + scale;
          var ratio = (scale+node2.radius) / (scale+node1.radius);
          var force =distance < minDistance ?  0.2*(minDistance - distance) : 0;
          if(force > 0) {
            node1.x = node1.x + ratio*force*x/Math.abs(x);
            node1.y = node1.y + ratio*force*y/Math.abs(y);
            node2.x = node2.x - (1/ratio)*force*x/Math.abs(x);
            node2.y = node2.y - (1/ratio)*force*y/Math.abs(y);
          }
        }
      });
    };
  }

  function fix(d){
    return typeof(d) === 'string'
      ? d == 'n/a'
        ? 0
        : +(d.replace(new RegExp(',', 'g'),'').replace('£','').replace('%', ''))
      : d;
  }

  function makeOptionsRadioButtons(base, map, name, className){
    var sizeInputs = base.selectAll("input").data(Object.keys(map)).enter().append('div');
    sizeInputs.append('input')
      .attr('type', 'radio')
      .attr('name', name)
      .attr('id', function(d){return name + d})
      .attr('value', function(d){return d})
      .filter(function(d, i){ return i==0})
      .attr('checked', "checked");
    var inputDetails = sizeInputs.append('label')
      .attr('for', function(d){return name + d}).html(function(d){return d})
      .append('div');
    inputDetails
      .filter(function(d){return typeof map[d].years !== 'undefined'})
      .each(function(d,i){
        var newInputs = d3.select(this).selectAll('input').data(map[d].years.reverse()).enter().append('span');
        newInputs.append('input')
          .attr('type', 'radio')
          .attr('name', d+' year')
          .attr('class', className)
          .attr('value', function(y){return y.value})
          .attr('id', function(y){return d + 'year' + y.value})
          .on('change.year', function(y){ y.action();})
          .filter(function(y){return y.value == map[d].year})
          .attr('checked',true);
        newInputs.append('label')
          .attr('for', function(y){return d + 'year' + y.value})
          .text(function(y){return y.value});
      })
    inputDetails
      .filter(function(d){return typeof map[d].sourceInfo !== 'undefined'})
      .append('div')
      .attr('class', 'sourceInfo')
      .html(function(d){return map[d].sourceInfo});
  }

  function drawRadiusKey(base, radiusGenerator){
    var radkey = base.selectAll("circle.radius.key").data(radiusGenerator.key);
    radkey.transition().attr("r", function(d){return d.radius})
    radkey.enter()
      .append('circle')
      .attr('cx', 30)
      .attr('cy', function(d,i){return 20+(40*i)})
      .attr("class", "radius key")
      .attr("r", function(d){return d.radius})
      .style("fill", "none")
      .style("stroke", "black");

    var radcaption =  base.selectAll("text.radius.key").data(radiusGenerator.key);
    radcaption.text(function(d){return d.caption});
    radcaption.enter()
      .append('text')
      .attr("alignment-baseline", "middle")
      .attr("class", "radius key")
      .text(function(d){return d.caption})
      .attr("x", 60)
      .attr("y", function(d,i){return 20+(40*i)});

  }

  function drawColourKey(base, colourGenerator){
    var colkey =  base.selectAll("circle.colour.key").data(colourGenerator.key);
    colkey.transition().duration(700).style("fill", function(d){return d.colour});
    colkey.exit().remove();
    colkey.enter()
      .append('circle')
      .attr('cx', width-30)
      .attr('cy', function(d,i){return 20+(40*i)})
      .attr("class", "colour key")
      .style("fill", function(d){return d.colour})
      .attr("r", 10);

    var colcaption = base.selectAll("text.colour.key").data(colourGenerator.key);
    colcaption.text(function(d){return d.caption});
    colcaption.exit().remove();
    colcaption.enter()
      .append('text')
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "end")
      .attr("class", "colour key")
      .text(function(d){return d.caption})
      .attr("x", width - 60)
      .attr("y", function(d,i){return 20+(40*i)});
  }

  function doRadii(generator, nodes){
    nodes.attr('r', function(d,i){
      d.radius = generator.radius(i);
      d.radiusCaption = generator.caption(i);
      return d.radius;
    })
  }

  function doColours(generator, nodes){
    nodes.style('fill', function(d,i){
      d.colour = generator.colour(i);
      d.colourCaption = generator.caption(i);
      return d.colour;
    })
  }

  function doCaption(nodes){
    nodes.each(function(d){
      d3.select(this).selectAll('title').data([d]).text(function(d, i){
      return d.name +"\n" + d.radiusCaption + "\n" + d.colourCaption;
    })})
  }

  function startForce(data, db){
      var force = d3.layout.force()
        .gravity(0.0)
        .friction(0.1)
        .charge(function(d){return -1*d.radius})
        .nodes(data)
        .size([width, height]);


      var options = makeOptions(db);

      function updateRadii(circles){
        var radiusGenerator = options.makeRadius(db);
        doRadii(radiusGenerator, circles);
        drawRadiusKey(svg, radiusGenerator);
        doCaption(circles);
        force.start();
      };

      function updateColours(circles){
        var colourGenerator = options.makeColour(db);
        doColours(colourGenerator, circles);
        drawColourKey(svg, colourGenerator);
        doCaption(circles);
      };

      var nodes = svg.selectAll("circle.datum").data(data);
      updateRadii(nodes);
      updateColours(nodes);

      force.on("tick", function(e) {
        nodes.each(position(e.alpha));
        nodes.each(collide(nodes, e.alpha));
        nodes
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      });

      d3.selectAll('input[name=sizeOption],input.radius.year')
        .on("change.main", function(){updateRadii(nodes.transition().duration(700))});

      d3.selectAll('input[name=colourOption],input.colour.year')
        .on("change.main",  function(){updateColours(nodes.transition().duration(700))});
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/res/london-vis/data.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    var db = new SQL.Database(uInt8Array);
    var statement = db.prepare(
      "SELECT * from boroughs JOIN locations ON boroughs.id = locations.id ORDER BY boroughs.id ASC"
    );
    var projection = d3.geo.mercator()
      .scale(scale*12000)
      .center([-0.1, 51.5085300])
      .translate([width/2, height/2]);
    var data = [];
    while(statement.step()){
      var result = statement.getAsObject();
      result.desiredLocation = projection([result.long, result.lat]);
      result.x = result.desiredLocation[0];
      result.y = result.desiredLocation[1];
      data.push(result);
     }
    startForce(data, db);
  };
  xhr.send();
}
