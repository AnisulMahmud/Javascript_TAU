const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');
const { emailInUse, getAllUsers, saveNewUser, validateUser, updateUserRole, getUserById, deleteUserById } = require('./utils/users');
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
    '/api/register': ['POST'],
    '/api/users': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
    if (filePath in allowedMethods) {
        response.writeHead(204, {
            'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
            'Access-Control-Allow-Headers': 'Content-Type,Accept',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Expose-Headers': 'Content-Type,Accept'
        });
        return response.end();
    }

    return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
    const idPattern = '[0-9a-z]{8,24}';
    const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
    return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
    return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
    // console.log('--------------------------')
    // console.log(request.headers)
    // console.log('--------------------------')
    const { url, method, headers } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;

    // serve static files from public/ and return immediately
    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        return renderPublic(fileName, response);
    }

    if (matchUserId(filePath)) {
        // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
        // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
        // If the HTTP method of a request is OPTIONS you can use sendOptions(filePath, response) function from this module
        // If there is no currently logged in user, you can use basicAuthChallenge(response) from /utils/responseUtils.js to ask for credentials
        //  If the current user's role is not admin you can use forbidden(response) from /utils/responseUtils.js to send a reply
        // Useful methods here include:
        // - getUserById(userId) from /utils/users.js
        // - notFound(response) from  /utils/responseUtils.js 
        // - sendJson(response,  payload)  from  /utils/responseUtils.js can be used to send the requested data in JSON format
        // const loggedInUser = await getCurrentUser(request);

     // AnisulMahmud's code
        if (matchUserId(filePath)) {

            if (method.toUpperCase() === 'GET') {
                const userId = filePath.split('/').pop();

               
                const loggedInUser = await getCurrentUser(request);

                if (!loggedInUser) {
                   
                    return responseUtils.basicAuthChallenge(response);
                }

                if (loggedInUser.role === 'customer') {
                    return responseUtils.forbidden(response);
                }

                


                if (loggedInUser.role === 'admin') {
                    const user = await getUserById(userId);
                    if (user) {
                        return responseUtils.sendJson(response, {
                            _id: userId,
                            name: loggedInUser.name,
                            email: loggedInUser.email,
                            password: loggedInUser.password,
                            role: 'admin'

                        });
                    } else {
                        return responseUtils.notFound(response);
                    }




                }
                const user = {

                    _id: userId,
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    password: loggedInUser.password,
                    role: 'admin'
                };
                if (!user) {
                    return responseUtils.notFound(response);
                }





            } 
            
            ///PUT
            else if (method.toUpperCase() === 'PUT') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);

                if (!loggedInUser) {
                
                    return responseUtils.basicAuthChallenge(response);
                }

                if (loggedInUser.role === 'admin') {
                    
                  
                    const updatedUserData = await parseBodyJson(request);
                    if (updatedUserData.role) {
                        if (updatedUserData.role === 'admin' || updatedUserData.role === 'customer') {
                            const user = await getUserById(userId);
                            if (user) {
                               
                                const updatedUser = updateUserRole(userId, updatedUserData.role);

                                if (updatedUser) {
                                    
                                    return responseUtils.sendJson(response, updatedUser);
                                } else {
                                  
                                    return responseUtils.badRequest(response, 'Invalid user data');
                                }

                            }
                        } else {
                            
                            return responseUtils.badRequest(response, 'Invalid request data');
                        }
                    } else {
                        
                        return responseUtils.badRequest(response, 'Invalid request data');
                    }
                } else {
                    
                    return responseUtils.forbidden(response);
                }
            }

            // Nasir-shuvo's code
            
            
            //DELETE
            
            
            else if (method.toUpperCase() === 'DELETE') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);

                if (!loggedInUser) {
                    
                    return responseUtils.basicAuthChallenge(response);
                }
                //console.log(loggedInUser.role);

                if (loggedInUser.role === 'admin') {
                    // User has admin credentials; proceed to delete the user
                    const deleted = await deleteUserById(userId);
                    //deleteUserById(userId);
                    console.log(deleted);

                    if (deleted) {
                        //user deleted
                      
                       return responseUtils.sendJson(response, deleted);
                    } else {
                       
                        return responseUtils.notFound(response);
                    }
                } else {
                    
                    return responseUtils.forbidden(response);
                }
            }
        }

       
        return responseUtils.notFound(response);
    }


    // Default to 404 Not Found if unknown url
    if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

    // See: http://restcookbook.com/HTTP%20Methods/options/
    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    // Check for allowable methods
    if (!allowedMethods[filePath].includes(method.toUpperCase())) {
        return responseUtils.methodNotAllowed(response);
    }

    // Require a correct accept header (require 'application/json' or '*/*')
    if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
    }

    // GET all users
    if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
        // TODO: 8.5 Add authentication (only allowed to users with role "admin")
        const loggedInUser = await getCurrentUser(request);
        if (loggedInUser) {
            if (loggedInUser.role === 'customer') {
                console.log('------customer------');

                return responseUtils.forbidden(response);
            } else if (loggedInUser.role === 'admin') {
                console.log('------admin------');
                return responseUtils.sendJson(response, getAllUsers());
            } else {
                console.log('------other------');

                return responseUtils.basicAuthChallenge(response);
            }
        } else {
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);
            }
            return responseUtils.basicAuthChallenge(response);
        }
    }

    // register new user
    if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
        // Fail if not a JSON request, don't allow non-JSON Content-Type
        if (!isJson(request)) {
            return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }

        //8.4
        const inputUser = await parseBodyJson(request);
        if (emailInUse(inputUser.email)) {
            return responseUtils.badRequest(response, '400 Bad Request');
        }
        if (!inputUser.password || !inputUser.email || !inputUser.name) {
            return responseUtils.badRequest(response, '400 Bad Request');
        }


        const newUser = await saveNewUser(inputUser);
        if (newUser) {

            const updatedUser = await updateUserRole(newUser._id, 'customer');
        }
        const userResponse = {
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            password: newUser.password,
            role: 'customer'
        };

        return responseUtils.createdResource(response, userResponse);
    }
};

module.exports = { handleRequest };