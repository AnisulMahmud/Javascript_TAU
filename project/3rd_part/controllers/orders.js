const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');


const Order = require('../models/order');

const getAllOrders = async(response, currentUser) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }
    if (currentUser.role === 'customer') {
        const orders = await Order.find({ customerId: currentUser._id });
        return responseUtils.sendJson(response, orders);
    }
    if (currentUser.role === 'admin') {
        const orders = await Order.find();
        return responseUtils.sendJson(response, orders);
    }
    return responseUtils.forbidden(response);

};

const viewOrder = async(response, orderId, currentUser) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }

    const order = await Order.findById(orderId).exec();
    if (order) {
        // console.log(order.customerId)
        // console.log(currentUser._id)
        // console.log(order.customerId.toString() == currentUser._id.toString())
        if (order.customerId.toString() === currentUser._id.toString() || currentUser.role === 'admin') {
            return responseUtils.sendJson(response, order);
        }
        return responseUtils.notFound(response);
    } else {
        return responseUtils.notFound(response);
    }
};

const postOrder = async(response, crurrentUser, inputData) => {

    if (inputData.items.length === 0) {
        return responseUtils.badRequest(response, 'All fields required !');
    }


    // const allItemsHaveRequiredProperties = inputData.items.every(item =>
    //     item.hasOwnProperty('quantity') &&
    //     item.hasOwnProperty('product') &&
    //     item.product.hasOwnProperty('_id') &&
    //     item.product.hasOwnProperty('price') &&
    //     item.product.hasOwnProperty('name')
    // );
    const allItemsHaveRequiredProperties = inputData.items.every(({ quantity, product }) =>
        quantity !== undefined &&
        product !== undefined &&
        product._id !== undefined &&
        product.price !== undefined &&
        product.name !== undefined
    );
    if (!allItemsHaveRequiredProperties) {
        return responseUtils.badRequest(response, 'All fields required !');
    }

    let savedOrder = '';
    try {
        const newOrder = new Order({
            customerId: crurrentUser._id,
            items: inputData.items,
        });

        savedOrder = await newOrder.save();
    } catch (error) {
        return responseUtils.sendJson(response, error.message);
    }

    return responseUtils.createdResource(response, savedOrder);

};


module.exports = { postOrder, viewOrder, getAllOrders };