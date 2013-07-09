var defaultCorsHeaders = require("./cors-header.js").defaultCorsHeaders;
var _ = require('underscore');

var storage = {};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  var response_body = [];

  console.log('step-1-main', request.method);

  if(request.method ==='GET'){
    console.log('step-2-GET');
    statusCode = 200;
    response_body = storage[request.url] || [];
    response_body = JSON.stringify(response_body);
    endResponse(statusCode);
  }else if(request.method === 'POST') {
    console.log('step-3-POST');
    request.setEncoding('utf8');

    var chunks = [];
    request.on('data', function(data){
      chunks.push(data);

      //everything here is for POST
      //if data is empty
      statusCode = 302;
      if(data === undefined){
        //do nothing
      } else {
        // console.log('POST data\n' + data);
        // console.log('data---', typeof data, '\n', data);
        // data = '{' + data + '}';
        // console.log('---', data, request.url);
        var inputData = _( JSON.parse(data) ).extend({'createdAt': new Date()});
        storage[request.url] = storage[request.url] || [];
        storage[request.url].push(inputData);
        //DO NOT stringify in this case because of the newline
        console.log('storage', storage);
        response_body = '\n';
        response_body = JSON.stringify(response_body);

      }
      //else
      //validate data befor inserting to storage
      //save the data to storage
      // response_body = {
      //   'results': [{'username':'user1', 'message':'msg1', 'createdAt':'today'},
      //               {'username':'user2', 'message':'msg2', 'createdAt':'yesterday'}]
      // };
    });
    request.on('end', function(){
      chunks = chunks.join('');
      endResponse(statusCode);
    });
  }else{
    endResponse(404);
  }

  function endResponse(statuscode){
    response.writeHead(statusCode, headers);
    response.end(response_body);
  }
};



exports.handleRequest = handleRequest;