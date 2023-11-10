const http = require('http');


http.createServer(function(request, response) {

    if(request.method=='POST'){
    let body = '';

    request
      .on('data', chunk => {
        body+= chunk.toString();
      })
      .on('end', () => {
        
        const splitBody= body.split('');
        const reverseBody = splitBody.reverse().join('');
      

      response.writeHead(200, { 'Content-Type': 'text/plain' });

    response.end(reverseBody); 
    });
  }
 
  }).listen(3000);