const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');
const User = require('../models/user');

/**
 * Your function description here.
 *
 * @param {object} response - The response object. (Add more details if necessary)
 * @returns {object} - returns object
 */
const getAllUsers = async(response) => {
    const dbUsers = await User.find({});
    return responseUtils.sendJson(response, dbUsers);
};

/**
 * Your function description here.
 *
 * @param {object} response - The response object. (Add more details if necessary)
 * @param {string} userId - The response object. (Add more details if necessary)
 * @param {object} currentUser - The response object. (Add more details if necessary)
 * @returns {object} - returns object
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
 * Your function description here.
 *
 * @param {object} response - The response object. (Add more details if necessary)
 * @param {string} userId - The response object. (Add more details if necessary)
 * @param {object} currentUser - The response object. (Add more details if necessary)
 * @param {object} userData - The response object. (Add more details if necessary)
 * @returns {object} - returns object
 */
const updateUser = async(response, userId, currentUser, userData) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }
    if (userId === currentUser.id) {
        return responseUtils.badRequest(response, 'Updating own data is not allowed');
    }
    if (currentUser.role === 'admin') {
        if (userData.role && (userData.role === 'admin' || userData.role === 'customer')) {

            try {
                const user = await User.findById(userId).exec();
                if (!user) {
                    return responseUtils.sendJson(response, { error: "404 Not Found" }, 404);
                }
                const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { role: userData.role } }, { new: true });

                // user.role = userData.role;
                // const updatedUser = await user.save();

                return responseUtils.sendJson(response, {
                    _id: userId,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    password: updatedUser.password,
                    role: userData.role
                }, 200);

            } catch (error) {
                console.error(error);
                return responseUtils.sendJson(response, { error: "Internal Server Error" }, 500);
            }
        } else {
            return responseUtils.sendJson(response, { error: "Internal Server Error" }, 400);

        }
    } else {
        return responseUtils.forbidden(response);

    }

};


/**
 * Your function description here.
 *
 * @param {object} response - The response object. (Add more details if necessary)
 * @param {string} userId - The response object. (Add more details if necessary)
 * @param {object} currentUser - The response object. (Add more details if necessary)
 * @returns {object} - returns object
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
                name: user.name,
                email: user.email,
                password: user.password,
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

const isValidEmail = (email) => {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Your function description here.
 *
 * @param {object} response - The response object. (Add more details if necessary)
 * @param {object} userData - The response object. (Add more details if necessary)
 * @returns {object} - returns object
 */
const registerUser = async(response, userData) => {

    if (await User.findOne({ email: userData.email })) {
        return responseUtils.badRequest(response, 'email already exists');
    }

    if (!userData.password || !userData.email || !userData.name) {
        return responseUtils.badRequest(response, 'All fields required !');
    }

    if (!isValidEmail(userData.email)) {
        return responseUtils.sendJson(response, {
            message: 'Email Not Valid.'
        }, 400);
    }
    if (userData.password.length < 10) {
        return responseUtils.sendJson(response, { message: 'Password Must be at least of 10 characters.' }, 400);
    }
    let newUser = '';
    try {
        newUser = new User({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'customer'
        });

        await newUser.save();
    } catch (error) {
        return responseUtils.sendJson(response, error.message);
    }

    return responseUtils.createdResource(response, {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: "customer"
    });

};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };