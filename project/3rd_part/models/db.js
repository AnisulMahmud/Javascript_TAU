require('dotenv').config();

const mongoose = require('mongoose');

/**
 * This is a brief description of yourFunction.
 *
 * @returns {string} Description of the return value.
 */

const getDbUrl = () => {
    const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/WebShopDb';
    return dbUrl;
};

/**
 * This is a brief description of yourFunction.
 *
 */
async function connectDB() {
    if (!mongoose.connection || mongoose.connection.readyState === 0) {
        await mongoose
            .connect(getDbUrl(), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
                autoIndex: true
            })
            .then(() => {
                mongoose.connection.on('error', err => {
                    console.error(err);
                });

                mongoose.connection.on('reconnectFailed', handleCriticalError);
            })
            .catch(handleCriticalError);
    }
}


/**
 * This is a brief description of yourFunction.
 *
 * @param {object} err - The err object. (Add more details if necessary)
 */
function handleCriticalError(err) {
    console.error(err);
    throw err;
}
/**
 * This is a brief description of yourFunction.
 *
 */
function disconnectDB() {
    mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, getDbUrl };