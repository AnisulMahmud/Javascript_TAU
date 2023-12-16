const http = require('http');
require('dotenv').config(); //loading enviornment

const { handleRequest } = require('./routes');
const { connectDB } = require('./models/db'); //importing the function 

connectDB(); //connection to databse

const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

server.on('error', err => {
  console.error(err);
  server.close();
});

server.on('close', () => console.log('Server closed.'));

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
