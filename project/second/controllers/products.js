/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');

const dbProducts = {
    products: require('../products.json').map(product => ({...product })),
    roles: ['customer', 'admin']
};

const getProducts = () => dbProducts.products.map(product => ({...product }));



const getAllProducts = async(response) => {
    console.log('lol');
    return responseUtils.sendJson(response, getProducts());
};

module.exports = { getAllProducts };
