const http = require('http');
const fs =  require('fs');


http.createServer(function(request, response){

    if(request.method==='GET') {
        fs.readFile('get.html', (err, data) =>{
            if(err){
                response.writeHead(500, {'Content-Type': 'text/html'});
                response.end('Internal Server Error');
            } 
            else{
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            }
            

        });
    }

    else if(request.method==='POST') {
        fs.readFile('post.html', (err, data) =>{
            if(err){
                response.writeHead(500, {'Content-Type': 'text/html'});
                response.end('Internal Server Error');
            } 
            else{
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            }
            

        });
    }

    else{
        response.writeHead(405, {'Content-Type': 'text/html' , 'Allow': 'GET , POST' });
        response.end('Method Not Allowed');
    }




}).listen(3000);