const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {

  const accHeader= request.headers['accept'];
  
  //TODO: implement sending responds to requests for XML, TXT, JSON, and */* handling JSON provided as an example.
  if ( (request.headers['accept'].includes('application/json')) || (request.headers['accept'].includes('*/*'))) {
    // You can use the readFileSendResponse(fileName, contentType, response) function 
    // to read a file and send the response or write your own. It's up to you. :-)
    readFileSendResponse('data.json' , 'application/json', response);
  }
  else if (request.headers['accept'].includes('application/xml')) {
    // You can use the readFileSendResponse(fileName, contentType, response) function 
    // to read a file and send the response or write your own. It's up to you. :-)
    readFileSendResponse('data.xml' , 'application/xml', response);
  }

  else if (request.headers['accept'].includes('text/plain')) {
    // You can use the readFileSendResponse(fileName, contentType, response) function 
    // to read a file and send the response or write your own. It's up to you. :-)
    readFileSendResponse('data.txt' , 'text/plain', response);
  }


  else {
    response.statusCode = 406;
    response.statusMessage = 'Content type not available';
    response.end();
  }
}).listen(3000);

/* 
  * @param {string} fileName - name of the file to be read
  * @param {string} contentType - type of the content to be sent in the response
  * @param {object} response - response object
  */
const readFileSendResponse = (fileName, contentType, response) => {
  fs.readFile(path.resolve(fileName), function (error, file) {
    if (error) {
      response.writeHead(404);
      response.write('An error occured: ', error);
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.write(file);
    }
    response.end();
  })
}