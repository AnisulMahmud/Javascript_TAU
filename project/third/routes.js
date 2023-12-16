const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { getAllUsers, registerUser, deleteUser, viewUser, updateUser } = require('./controllers/users');
const { getAllProducts, viewProduct, updateProduct, deleteProduct, createProduct } = require('./controllers/products');
const { postOrder, viewOrder, getAllOrders } = require('./controllers/orders');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');


const allowedMethods = {
    '/api/register': ['POST'],
    '/api/users': ['GET'],
    '/api/products': ['GET', 'POST'],
    '/api/orders': ['POST', 'GET'],
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
const matchProductId = url => {
    return matchIdRoute(url, 'products');
};
const matchOrderId = url => {
    return matchIdRoute(url, 'orders');
};

const handleRequest = async(request, response) => {
    const { url, method, headers } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;

    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        return renderPublic(fileName, response);
    }
    //user routes
    if (matchUserId(filePath)) {
        if (matchUserId(filePath)) {

            //view single user
            if (method.toUpperCase() === 'GET') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);
                if (!acceptsJson(request)) {
                    return responseUtils.contentTypeNotAcceptable(response);
                }
                return viewUser(response, userId, loggedInUser);
            }
            //update user
            else if (method.toUpperCase() === 'PUT') {
                console.log('-------update route---------');

                if (!request.headers['authorization']) {
                    return responseUtils.basicAuthChallenge(response);
                }
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);
                // console.log(loggedInUser)

                if (!acceptsJson(request)) {
                    return responseUtils.contentTypeNotAcceptable(response);
                }

                const updatedUserData = await parseBodyJson(request);
                // console.log(await updateUser(response, loggedInUser, userId, updatedUserData))
                return await updateUser(response, userId, loggedInUser, updatedUserData);
                // return responseUtils.sendJson(response, {}, 200)
            }
            //delete user
            else if (method.toUpperCase() === 'DELETE') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);
                if (!request.headers['authorization']) {
                    return responseUtils.basicAuthChallenge(response);
                }
                if (!acceptsJson(request)) {
                    return responseUtils.contentTypeNotAcceptable(response);
                }
                return deleteUser(response, userId, loggedInUser);
            }
        }

        return responseUtils.notFound(response);
    }
    //product routes
    if (matchProductId(filePath)) {

        //view single product
        if (method.toUpperCase() === 'GET') {
            const productId = filePath.split('/').pop();
            const loggedInUser = await getCurrentUser(request);
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);

            }
            if (!acceptsJson(request) || !request.headers.accept) {
                return responseUtils.contentTypeNotAcceptable(response);
            }
            return viewProduct(response, productId, loggedInUser);
        }

        //update product
        else if (method.toUpperCase() === 'PUT') {
            const productId = filePath.split('/').pop();
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);
            }
            const loggedInUser = await getCurrentUser(request);
            if (!acceptsJson(request) || !request.headers.accept) {
                return responseUtils.contentTypeNotAcceptable(response);
            }
            // console.log(request.data)
            const inputData = await parseBodyJson(request);
            // console.log(inputData) /
            return await updateProduct(response, productId, loggedInUser, inputData);
        }
        //delete product
        else if (method.toUpperCase() === 'DELETE') {
            if (!acceptsJson(request)) {
                return responseUtils.contentTypeNotAcceptable(response);
            }
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);
            }

            const productId = filePath.split('/').pop();
            const loggedInUser = await getCurrentUser(request);

            return deleteProduct(response, productId, loggedInUser);
        }

        return responseUtils.notFound(response);

    }
    // order routes
    if (matchOrderId(filePath)) {
        //view single order
        if (method.toUpperCase() === 'GET') {

            if (!acceptsJson(request)) {
                return responseUtils.contentTypeNotAcceptable(response);
            }
            if (!request.headers['authorization']) {
                return responseUtils.basicAuthChallenge(response);
            }
            const orderId = filePath.split('/').pop();
            const loggedInUser = await getCurrentUser(request);
            return viewOrder(response, orderId, loggedInUser);
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
                    const allDbUSers = await getAllUsers(response);
                    // console.log('-------')
                    // console.log(typeof allDbUSers)
                    // console.log('-------')
                    return await allDbUSers;

                } catch (error) {
                    // console.error(error);
                    return responseUtils.internalServerError(response);
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

    //get all orders
    if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
        const loggedInUser = await getCurrentUser(request);
        if (!request.headers['authorization']) {
            return responseUtils.basicAuthChallenge(response);
        }
        return getAllOrders(response, loggedInUser);
    }


    //create product
    if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
        if (!acceptsJson(request)) {
            return responseUtils.badRequest(response);
        }
        if (!isJson(request)) {
            return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }
        const loggedInUser = await getCurrentUser(request);
        const inputData = await parseBodyJson(request);

        return createProduct(response, loggedInUser, inputData);
    }

    //post order
    if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
        const loggedInUser = await getCurrentUser(request);
        if (!loggedInUser) {
            return responseUtils.basicAuthChallenge(response);
        }

        if (loggedInUser.role === 'customer') {
            if (!isJson(request)) {
                return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
            }
            const inputData = await parseBodyJson(request);
            return postOrder(response, loggedInUser, inputData);
        } else {
            return responseUtils.forbidden(response);
        }
    }


    return responseUtils.notFound(response);
};

module.exports = { handleRequest };