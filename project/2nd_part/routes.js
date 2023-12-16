const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { getAllUsers, registerUser, deleteUser, viewUser, updateUser } = require('./controllers/users');
const { getAllProducts } = require('./controllers/products');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');


const allowedMethods = {
    '/api/register': ['POST'],
    '/api/users': ['GET'],
    '/api/products': ['GET'],
};

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

const matchIdRoute = (url, prefix) => {
    const idPattern = '[0-9a-z]{8,24}';
    const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
    return regex.test(url);
};

const matchUserId = url => {
    return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
    const { url, method, headers } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;

    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        return renderPublic(fileName, response);
    }

    if (matchUserId(filePath)) {
        if (matchUserId(filePath)) {

            //view single user
            if (method.toUpperCase() === 'GET') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);
                return viewUser(response, userId, loggedInUser);
            }
            //update user
            else if (method.toUpperCase() === 'PUT') {
                console.log('-------update route---------');

                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);
                if (!loggedInUser) {
                    return responseUtils.basicAuthChallenge(response);
                }
                if (!request.headers['authorization']) {
                    return responseUtils.basicAuthChallenge(response);
                }
                const updatedUserData = await parseBodyJson(request);
                return updateUser(response, loggedInUser, userId, updatedUserData);
            }
            //delete user
            else if (method.toUpperCase() === 'DELETE') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);

                return deleteUser(response, userId, loggedInUser);
            }
        }

        return responseUtils.notFound(response);
    }

    if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    if (!allowedMethods[filePath].includes(method.toUpperCase())) {
        return responseUtils.methodNotAllowed(response);
    }

    if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
    }


    //get all users
    if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
        const loggedInUser = await getCurrentUser(request);
        if (loggedInUser) {
            if (loggedInUser.role === 'customer') {
                return responseUtils.forbidden(response);
            } else if (loggedInUser.role === 'admin') {
                try {
                    return getAllUsers(response);
                } catch (error) {
                    console.error(error);
                    return responseUtils.serverError(response);
                }
            } else {
                return responseUtils.basicAuthChallenge(response);
            }
        } else {
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);
            }
            return responseUtils.basicAuthChallenge(response);
        }
    }

    // register user
    if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
        if (!isJson(request)) {
            return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }
        const inputUser = await parseBodyJson(request);
        console.log('-----------lol---');

        return registerUser(response, inputUser);
    }

    //get all products
    if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
        const loggedInUser = await getCurrentUser(request);
        if (!loggedInUser) {
            return responseUtils.basicAuthChallenge(response);
        }
        if (loggedInUser.role === 'customer' || loggedInUser.role === 'admin') {
            return getAllProducts(response);
        } else {
            return responseUtils.forbidden(response);
        }
    }
};

module.exports = { handleRequest };
