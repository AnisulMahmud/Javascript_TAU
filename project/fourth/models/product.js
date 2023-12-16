const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50


    },
    price: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    image: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },


});


// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;