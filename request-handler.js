var defaultCorsHeaders = require("./cors-header.js").defaultCorsHeaders;

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";


  var storage = {};
  // storage[request.url] =

  var response_body = [];

  var post_data = [];


  request.on('data', function(data){

    if(request.method ==='GET'){
      console.log('GET request');
      //if client sends a GET request
      //200
      //try getting something from storage for client
      //if there is a hit, 200
      //else something else
      statusCode = 200;
      // response_body = [];

    } else if(request.method === 'POST') {
      //everything here is for POST
      //if data is empty
      if(data === undefined){
        //do nothing
      } else {
        console.log('POST data\n' + data);
      }
      //else
      //validate data befor inserting to storage
      //save the data to storage
      // statusCode = 302;
      // response_body = {
      //   'results': [{'username':'user1', 'message':'msg1', 'createdAt':'today'},
      //               {'username':'user2', 'message':'msg2', 'createdAt':'yesterday'}]
      // };
    }
    response.writeHead(statusCode, headers);
    response.end('\n', 'utf8');

  });


  // response.end(JSON.stringify(response_body), 'utf8');
};



exports.handleRequest = handleRequest;