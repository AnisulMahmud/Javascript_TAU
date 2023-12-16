const { getCurrentUser } = require('../auth/auth');
const responseUtils = require('../utils/responseUtils');

// const dbProducts = {
//     products: require('../products.json').map(product => ({...product })),
//     roles: ['customer', 'admin']
// };

// const getProducts = () => dbProducts.products.map(product => ({...product }));

const Product = require('../models/product');

const getAllProducts = async(response) => {
    const products = await Product.find({});
    return responseUtils.sendJson(response, products);
};

const viewProduct = async(response, productId, currentUser) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }

    const product = await Product.findById(productId).exec();
    if (product) {
        return responseUtils.sendJson(response, {
            _id: productId,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
        });
    } else {
        return responseUtils.notFound(response);
    }
};

const deleteProduct = async(response, productId, currentUser) => {
    try {
        if (!currentUser) {
            return responseUtils.basicAuthChallenge(response);
        }

        if (currentUser.role === 'admin') {
            const product = await Product.findById(productId);

            if (!product) {
                return responseUtils.notFound(response);
            }

            const deletedProduct = await Product.findByIdAndDelete(productId).exec();

            if (!deletedProduct) {
                return responseUtils.internalServerError(response);
            }

            return responseUtils.sendJson(response, {
                _id: productId,
                name: product.name,
                image: product.image,
                price: product.price,
                description: product.description
            });
        } else {
            return responseUtils.forbidden(response);
        }
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        return responseUtils.internalServerError(response);
    }
};



const updateProduct = async(response, productId, currentUser, productData) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }

    if ((productData.price < 1) || (typeof productData.price !== 'number') || !productData.name) {
        return responseUtils.badRequest(response, 'price must be greater than 0');
    }

    if (currentUser.role === 'admin') {
        if (productData.name && productData.price) {
            try {
                const product = await Product.findById(productId).exec();
                console.log(product);
                if (!product) {
                    return responseUtils.sendJson(response, { error: "404 Not Found" }, 404);
                }

                // product.name = productData.name;
                // product.price = productData.price;
                // product.image = productData.image;
                // product.description = productData.description;
                // const updatedProduct = await product.save();

                const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, { $set: productData }, { new: true });

                return responseUtils.sendJson(response, {
                    _id: productId,
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    image: updatedProduct.image,
                }, 200);

            } catch (error) {
                console.error(error);
                return responseUtils.sendJson(response, { error: "Internal Server Error" }, 500);
            }
        } else {
            return responseUtils.badRequest(response, 'All Fields Required.');

        }
    } else {
        return responseUtils.forbidden(response);

    }

};

const createProduct = async(response, currentUser, inputData) => {
    if (!currentUser) {
        return responseUtils.basicAuthChallenge(response);
    }
    if (!inputData.name || !inputData.price) {
        return responseUtils.badRequest(response, 'All fields required !');
    }

    if (currentUser.role === 'admin') {
        let saveProduct = '';
        try {
            const newProduct = new Product({
                name: inputData.name,
                price: inputData.price,
                description: inputData.description,
                image: inputData.image,
            });

            saveProduct = await newProduct.save();
        } catch (error) {
            return responseUtils.sendJson(response, error.message);
        }
        return responseUtils.createdResource(response, saveProduct);
    } else {
        return responseUtils.forbidden(response);
    }



};


module.exports = { getAllProducts, viewProduct, updateProduct, deleteProduct, createProduct };