const {getCredentials} = require("../utils/requestUtils");

// user model
const User = require("../models/user"); 


/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
    // TODO: 8.5 Implement getting current user based on the "Authorization" request header

    // NOTE: You can import two methods which can be useful here: // - getCredentials(request) function from utils/requestUtils.js
    // - getUser(email, password) function from utils/users.js to get the currently logged in user

    // throw new Error('Not Implemented');
    const authCredential = await getCredentials(request);

    if (authCredential) {
        const [email,password ] = authCredential;
        
        /*if credentials are found, use User model findOne() method to find a user with the credential email
           if no user with an email from the request is found, return null
           use the User model's checkPassword to check the user password. 
           If the passwords match, return the user, else return null
        */   
        const user = await User.findOne({email}); 

        if(!user || !(await user.checkPassword(password))) {
            return null;
        }
        return user;
    } else{
        return null;
    }

};

module.exports = { getCurrentUser };