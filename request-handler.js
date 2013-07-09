var defaultCorsHeaders = require("./cors-header.js").defaultCorsHeaders;
var _ = require('underscore');
var fs = require('fs');
var CHATLOG = 'chatlog.txt';
var chatPath = '/Users/hackreactor/code/haoliu119/2013-06-chat-client';

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

  var headers = defaultCorsHeaders;
  headers['contentType'] = "application/json";
  var response_body = ''; //default, string!!!

  if(request.url.match(/\/classes\/.*/)){
    if(request.method ==='GET'){
      console.log(storage);
      response_body = storage[request.url] || [];
      response_body = JSON.stringify({'results': response_body});
      endResponse(200);
    }else if(request.method === 'POST') {
      var chunks = [];

      request.on('data', function(data){
        chunks.push(data);
      });

      request.on('end', function(){
        chunks = chunks.join('');
        var inputData = _( JSON.parse(chunks) ).extend({'createdAt': new Date()});
        storage[request.url] = storage[request.url] || [];
        storage[request.url].push(inputData);
        endResponse(200);

        fs.writeFile(CHATLOG, JSON.stringify(storage), function (err) {
          if (err) throw err;
        });

      });
    } else {
      endResponse(404);
    }

  }else if(request.url==='/'){
    console.log('Serving the html and js file of chat client.');
    //read the file
    fs.readFile(chatPath + '/index.html', {'encoding': 'utf8'}, function(err, data){
      if (err) {
        console.log('err', err);
        // throw err;
      }
      response_body = data;
      endResponse(200);
    });
    //serve the file

  }else {
    var relPath = request.url;
    //if match regrex, got to index.html
    if( relPath.match(/^\/\?/) ){
      relPath = '/index.html';
    }

    //else readFile
    fs.readFile(chatPath + relPath, {'encoding': 'utf8'}, function(err, data){
      if (err) {
        console.log('err', err);
        // throw err;
      }
      response_body = data;
      endResponse(200);
    });

    // endResponse(404);
  }

  function endResponse(statuscode){
    console.log('endResponse', statuscode);
    response.writeHead(statuscode, headers);
    response.end(response_body);
  }
};



exports.handleRequest = handleRequest;