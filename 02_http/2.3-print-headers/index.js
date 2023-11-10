const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function(request, response) {
 // fs.readFile(path.resolve('index.html'), function(error, htmlPage) {

      response.writeHead(200, { 'Content-Type': 'text/html' });
      const header= request.headers;
      response.write(JSON.stringify(request.headers));
    response.end();
  }).listen(3000);