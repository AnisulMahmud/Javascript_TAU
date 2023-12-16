/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */

const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');
const User = require('../models/user');

const getAllUsers = async(response) => {
    return responseUtils.sendJson(response, await User.find({}, { password: 0 }));
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async(response, userId, currentUser) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }
    if (userId === currentUser.id) {
        return responseUtils.badRequest(response, 'Updating own data is not allowed');
    }

    if (currentUser.role === 'admin') {
        const deleted = await User.findByIdAndDelete(userId).exec();
        if (deleted) {
            return responseUtils.sendJson(response, deleted);
        } else {
            return responseUtils.notFound(response);
        }
    } else {
        return responseUtils.forbidden(response);
    }
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async(response, userId, currentUser, userData) => {


    if (userId === currentUser.id) {
        return responseUtils.badRequest(response, 'Updating own data is not allowed');
    }
    if (userData.password.length < 10) {
        return responseUtils.badRequest(response, '');
    }
    console.log('----------------');
    console.log(currentUser.role);
    if (currentUser.role === 'admin') {
        console.log('--------inside--------');

        if (userData.role && (userData.role === 'admin' || userData.role === 'customer')) {
            const user = await User.findById(userId).exec();
            if (user) {
                const updatedUser = await User.findByIdAndUpdate(userId, { role: userData.role }, { new: true }).exec();
                if (updatedUser) {
                    return responseUtils.sendJson(response, {
                        _id: userId,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        password: updatedUser.password,
                        role: updatedUser.role
                    });
                } else {
                    return responseUtils.badRequest(response, 'Invalid user data');
                }
            } else {
                return responseUtils.notFound(response);

            }
        } else {
            return responseUtils.badRequest(response, 'Invalid request data');
        }
    } else {
        return responseUtils.forbidden(response);
    }
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }

    if (currentUser.role === 'customer') {
        return responseUtils.forbidden(response);
    }

    if (currentUser.role === 'admin') {
        const user = await User.findById(userId).exec();
        if (user) {
            // return responseUtils.sendJson(response, user);
            return responseUtils.sendJson(response, {
                _id: userId,
                name: currentUser.name,
                email: currentUser.email,
                password: currentUser.password,
                role: 'customer'
            });
        } else {
            return responseUtils.notFound(response);
        }
    }
    const user = await User.findById(userId).exec();
    if (!user) {
        return responseUtils.notFound(response);
    }
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const isValidEmail = (email) => {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // return emailRegex.test(email);
    return true;
};
const registerUser = async(response, userData) => {

    if (await User.findOne({ email: userData.email })) {
        return responseUtils.badRequest(response, '400 Bad Request');
    }

    if (!userData.password || !userData.email || !userData.name) {
        return responseUtils.badRequest(response, '400 Bad Request');
    }

    if (isValidEmail(userData.email)) {
        return responseUtils.badRequest(response, '');
    }
    if (userData.password.length < 10) {
        return responseUtils.badRequest(response, '');
    }
    console.log('-----------lol');
    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'customer'
    });

    await newUser.save();

    return responseUtils.createdResource(response, {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
    });

};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
