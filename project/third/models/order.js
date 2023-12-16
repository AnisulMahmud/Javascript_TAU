const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
});

const itemSchema = new Schema({
    product: { type: productSchema, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, required: true },
    items: { type: [itemSchema], required: true },
});






// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;