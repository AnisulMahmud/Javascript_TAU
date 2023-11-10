const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function(request, response) {
  fs.readFile(path.resolve('index.html'), function(error, htmlPage) {
    if (error) {
      response.writeHead(202);
      response.write('An error occured: ', error);
    } else {
      response.writeHead(202, { 'Content-Type': 'text/html' });
      response.write(htmlPage);
    }
    response.end();
  });
}).listen(3000);