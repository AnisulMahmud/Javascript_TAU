const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');


const users = [{
    username: 'good_user',
    password: 'good_pass',
    cookie_secret: 1234567890
}]


let currentUser = {};


let csrfTokens = [];

http.createServer(function(request, response) {
   
    if (request.url === '/' || request.url === '') {
        fs.readFile(__dirname + '/good_server.html', function(error, htmlPage) {
            if (error) {
                response.writeHead(404);
                response.end(JSON.stringify(err));
                return;
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(htmlPage);
            }
            response.end();
            return;
        });
    }
 
    else if (request.url === '/login' && request.method === 'POST') {
        let formBody = "";
        request.on('data', function(chunk) {
            formBody += chunk;
        });
        request.on('end', function() {
            const loginInput = querystring.parse(formBody);
            const userArray = checkUser(loginInput.username, loginInput.passw);
            if (userArray.length === 1) {
                currentUser = userArray[0];
                response.setHeader('Set-Cookie', ['secret_for_good_server=' + currentUser.cookie_secret]);
                response.end(
                    `
                            <!doctype html>
                            <html lang="en">
                            
                            <head>
                                <meta charset="utf-8">
                                <title>The Good Server</title>
                            </head>
                            <body>
                                <p>You have now logged in!</p>
                                <p>You can move on to <a href="/money_transfer"> transferring money</a>.</p>
                            </body>
                            </html>
                            `
                );
                return;
            } else {
                response.statusCode = 403;
                response.statusMessage = "Wrong username and/or password!"
                response.end(`${response.statusCode} - Wrong username and/or password!`);
                return;
            }
        })
    } else if (request.url.match(/^\/money_transfer.*/)) {
        const cookies = querystring.parse(request.headers['cookie'], '; ');
        const query = url.parse(request.url, true).query;
       
        if (cookies.secret_for_good_server != users[0].cookie_secret) {
            response.statusCode = 403;
            response.statusMessage = "Missing or wrong secret cookie";
            response.end('Missing or wrong secret cookie');
            return;
        }
    
        else if (!query.to || !query.sum || !query.from) {
            response.writeHead(200, { 'Content-Type': 'text/html' });

            response.end(
                ` 
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>The Good Server</title>
                </head>
                <body>
                    <p>Transfer money to other users with the super safe form which uses the latest HTTP GET method!</p>
                    <form action="/money_transfer" method="get">
                        <div class="container">
                            <input type="hidden" value="${setCSRFtoken()}" name="csrf_token">
                            <label for="from"><b>Transfer from</b></label>
                            <input type="text" value="good_user" name="from" required readonly>
                            <label for="to"><b>Transfer to</b></label>
                            <input type="text" placeholder="User you want to send money to" name="to" required>
                            <label for="sum"><b>Sum to transfer (in full Euros)</b></label>
                            <input type="number" placeholder="Enter a sum" name="sum" required>
                            <button type="submit">Transfer money</button>
                        </div>
                    </form>
                </body>
                </html>
                `
            );
            return;
        }
        
        else if (checkCSRFtoken(query.csrf_token) === -1) {
            response.statusCode = 403;
            response.statusMessage = "Missing or wrong CSRF token";
            response.end('Missing or wrong CSRF token');
            return;
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(
                `
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>The Good Server</title>
                </head>
                <body>
                    <p>The sum of ${query.sum} Euros was transferred from user good_user to user ${query.to}</p>
                    <p><a href="/money_transfer/">Perform another money transfer</a></p>            
                </body >
                </html >
            `

            );
            return;
        }
    } else {
        response.writeHead(404);
        response.write('Page not found or wrong HTTP method used');
        response.end();
        return;
    }
}).listen(3000);



const checkUser = (userName, password) => {
    const userHopefully = users.filter((user) => {
        return (user.username === userName && user.password === password);
    })
    return userHopefully;
}



const setCSRFtoken = () => {
    const randomToken = Math.random().toString(36).slice(2, 12); // Generates a random 10-character token
    csrfTokens.push(randomToken); // Store the token in the csrfTokens array
    return randomToken;
};




const checkCSRFtoken = (token) => {
    const index = csrfTokens.findIndex((t) => t === token);
    if (index !== -1) {
        csrfTokens.splice(index, 1);
    }
    return index;
};