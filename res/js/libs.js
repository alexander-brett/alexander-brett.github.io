function fix(d){
  return typeof(d) === 'string'
    ? d == 'n/a'
      ? 0
      : +(d.replace(new RegExp(',', 'g'),'').replace('£','').replace('%', ''))
    : d;
}

function loadUrl(url, responseType){
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = responseType;
    xhr.onload = function(e) {resolve(xhr.response);};
    xhr.send();
  });
}

function loadDatabase(url){
  return loadUrl(url, "arraybuffer").then(function(response){
    var uInt8Array = new Uint8Array(response);
    return new SQL.Database(uInt8Array);
  })
};

function sqlQuery(db, querystring){
  var query = db.exec(querystring);
  var data = {};
  query[0].values.forEach(function(value){data[value[0]] = value[1];});
  return data;
}
