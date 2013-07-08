var defaultCorsHeaders = require("./cors-header.js").defaultCorsHeaders;

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";


  var storage = {};
  var response_body = [];


  request.on('data', function(data){
    //regrex testing for :8080/classes/.*
    if(!request.url.match(/\:\d+\/classes\/.*/)){
      statusCode = 404;
      response_body = null;
    } else if(request.method ==='GET'){
      //if client sends a GET request
      //200
      //try getting something from storage for client
      //if there is a hit, 200
      //else something else
      statusCode = 200;
      response_body = storage[request.url] || [];
      response_body = JSON.stringify(response_body);

    } else if(request.method === 'POST') {
      //everything here is for POST
      //if data is empty
      statusCode = 302;
      if(data === undefined){
        //do nothing
      } else {
        // console.log('POST data\n' + data);
        //DO NOT stringify in this case because of the newline
        console.log('data---', typeof data, '\n', data);
        // data = '{' + data + '}';
        console.log('---', data, request.url);
        storage[request.url] = JSON.parse(data);
        response_body = '\n';
      }
      //else
      //validate data befor inserting to storage
      //save the data to storage
      // response_body = {
      //   'results': [{'username':'user1', 'message':'msg1', 'createdAt':'today'},
      //               {'username':'user2', 'message':'msg2', 'createdAt':'yesterday'}]
      // };
    }
    response.writeHead(statusCode, headers);
    response.end(response_body, 'utf8');

  });

};



exports.handleRequest = handleRequest;