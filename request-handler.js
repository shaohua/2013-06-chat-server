/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

// var defaultCorsHeaders = require('./basic-server.js').defaultCorsHeaders;
var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  response.writeHead(statusCode, headers);

  var storage = {};
  // storage[request.url] =
  // console.log('request obj', request);


  var output = {
    'results': [{'username':'user1', 'message':'msg1', 'createdAt':'today'},
                {'username':'user2', 'message':'msg2', 'createdAt':'yesterday'}]
  };

  response.write(JSON.stringify(output), 'utf8');
  response.end();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;