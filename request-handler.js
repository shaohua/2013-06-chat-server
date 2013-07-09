var defaultCorsHeaders = require("./cors-header.js").defaultCorsHeaders;
var _ = require('underscore');
var fs = require('fs');
var CHATLOG = 'chatlog.txt';

var storage = {};

fs.exists(CHATLOG, function (exists) {
  if(exists){
    fs.readFile(CHATLOG, {'encoding':'utf8'}, function (err, data) {
      if (err) throw err;
      storage = JSON.parse(data);
    });
  }
});



var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['contentType'] = "application/json";
  var response_body = ''; //default, string!!!

  if(request.url.match(/\/classes\/.*/)){
    if(request.method ==='GET'){
      console.log(storage);
      statusCode = 200;
      response_body = storage[request.url] || [];
      response_body = JSON.stringify({'results': response_body});
      endResponse(statusCode);
    }else if(request.method === 'POST') {
      statusCode = 200;
      var chunks = [];

      request.on('data', function(data){
        chunks.push(data);
      });

      request.on('end', function(){
        chunks = chunks.join('');
        var inputData = _( JSON.parse(chunks) ).extend({'createdAt': new Date()});
        storage[request.url] = storage[request.url] || [];
        storage[request.url].push(inputData);
        endResponse(statusCode);

        fs.writeFile(CHATLOG, JSON.stringify(storage), function (err) {
          if (err) throw err;
        });

      });
    } else {
      endResponse(404);
    }

  }else{
    console.log('here');
    endResponse(404);
  }

  function endResponse(statuscode){
    console.log('endResponse', statuscode);
    response.writeHead(statuscode, headers);
    response.end(response_body);
  }
};



exports.handleRequest = handleRequest;