const http = require('http');
const port = 3000;
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {

  /** TODO: add the required CORS headers 
   * as speciiied in the exercise instructions.
   * You can define your CORS header with something
   * like the following:
   * const headers = {
      'header_1_name': 'header_1_value',
      'header_2_name': 'header_2_value',
      ...
      };
      This syntax enables using the defined CORS headers with  writeHead() method in the TODOs below. See writeHead() method parameters: (https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers).
  */
 // 4hours in seconds=14400

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
    'Access-Control-Max-Age' : '14400', 

  };
  

  let filePath = path.join(__dirname, 'index.html');
  let stat = fs.statSync(filePath);




  // TODO: check that Origin header is set in all incoming requests
  // You can access the header with req.headers['origin']
  // You can check if a header is present in request headers with if(!req.headers['yourHeaderNameHere']){..

  // TODO: handle GET and POST HTTP methods
  // You can use req.method to access the request method 
  // remember to add CORS headers to response, you can use writeHead() here 

  // TODO: handle HEAD HTTP method, 
  // remember to add CORS headers to response

  // TODO: handle HTTP methods that are not allowed, 
  // remember to add CORS headers to response



  if (!req.headers['origin']) {
    res.writeHead(400, headers);
    res.end('Origin header not in the request');
    return;
  }

 if (req.method === 'GET' || req.method === 'POST') {
  res.writeHead(200, headers);
  res.end('I was requested using CORS!');
  return;
  
} else if (req.method === 'HEAD') {

  res.writeHead(200, headers);
  res.end();
  return;
}else if(req.method === 'HTTP'){
  
  res.writeHead(405, headers);
  res.end('Request used a HTTP method which is not allowed.');
  return; 

}else {
  
  res.writeHead(405, headers);
  res.end('Request used a HTTP method which is not allowed.');
  return;
  
}
  

}).listen(port);

