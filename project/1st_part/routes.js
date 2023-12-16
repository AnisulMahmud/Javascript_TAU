const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getCurrentUser } = require('./auth/auth');
const User = require('./models/user');

const dbProducts = {
    products: require('./products.json').map(product => ({ ...product })),
  roles: ['customer', 'admin']
};
const getProducts = () => dbProducts.products.map(product => ({ ...product }));

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

const handleRequest = async (request, response) => {
    const { url, method, headers } = request;
    const filePath = new URL(url, `http://${headers.host}`).pathname;

    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        return renderPublic(fileName, response);
    }

    if (matchUserId(filePath)) {
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
                    const user = await User.findById(userId).exec();
                    if (user) {
                        return responseUtils.sendJson(response, {
                            _id: userId,
                            name: loggedInUser.name,
                            email: loggedInUser.email,
                            role: 'admin'
                        });
                    } else {
                        return responseUtils.notFound(response);
                    }
                }
                const user = await User.findById(userId).exec();
                if (!user) {
                    return responseUtils.notFound(response);
                }
            } else if (method.toUpperCase() === 'PUT') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);

                if (!loggedInUser) {
                    return responseUtils.basicAuthChallenge(response);
                }

                if (loggedInUser.role === 'admin') {
                    const updatedUserData = await parseBodyJson(request);
                    if (updatedUserData.role && (updatedUserData.role === 'admin' || updatedUserData.role === 'customer')) {
                        const user = await User.findById(userId).exec();
                        if (user) {
                            const updatedUser = await User.findByIdAndUpdate(userId, { role: updatedUserData.role }, { new: true }).exec();
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
                    return responseUtils.forbidden(response);
                }
            } else if (method.toUpperCase() === 'DELETE') {
                const userId = filePath.split('/').pop();
                const loggedInUser = await getCurrentUser(request);

                if (!loggedInUser) {
                    return responseUtils.basicAuthChallenge(response);
                }

                if (loggedInUser.role === 'admin') {
                    const deleted = await User.findByIdAndDelete(userId).exec();
                    if (deleted) {
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

    if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    if (!allowedMethods[filePath].includes(method.toUpperCase())) {
        return responseUtils.methodNotAllowed(response);
    }

    if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
    }

    if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
        const loggedInUser = await getCurrentUser(request);
        if (loggedInUser) {
            if (loggedInUser.role === 'customer') {
                return responseUtils.forbidden(response);
            } else if (loggedInUser.role === 'admin') {
                try {
                    const users = await User.find({}, { password: 0 }); // Exclude password from the response
                    return responseUtils.sendJson(response, users);
                } catch (error) {
                    console.error(error);
                    return responseUtils.serverError(response);
                }

             //return responseUtils.sendJson(response, jsonResponse);
                
               
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

    if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
        if (!isJson(request)) {
            return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }
    
        const inputUser = await parseBodyJson(request);
        if (await User.findOne({ email: inputUser.email })) {
            return responseUtils.badRequest(response, '400 Bad Request');
        }
        if (!inputUser.password || !inputUser.email || !inputUser.name) {
            return responseUtils.badRequest(response, '400 Bad Request');
        }
    
        const newUser = new User({
            name: inputUser.name,
            email: inputUser.email,
            password: inputUser.password,
            role: 'customer'
        });
        await newUser.save();
    
        // Updated response format to match test case expectations
        return responseUtils.createdResource(response, {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role
        });
    }

    if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
        const loggedInUser = await getCurrentUser(request);

        if (!loggedInUser) {
            return responseUtils.basicAuthChallenge(response);
        }

        if (loggedInUser.role === 'customer' || loggedInUser.role === 'admin') {
            const allProducts = await getProducts();
            return responseUtils.sendJson(response, allProducts);
        } else {
            return responseUtils.forbidden(response);
        }
    }
};

module.exports = { handleRequest };
