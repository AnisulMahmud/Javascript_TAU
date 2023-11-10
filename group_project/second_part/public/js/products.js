const addToCart = (productId, productName) => {
    // TODO 9.2
    // you can use addProductToCart(), available already from /public/js/utils.js
    // for showing a notification of the product's creation, /public/js/utils.js  includes createNotification() function

    addProductToCart(productId);
    const notificationMessage = `${productName} has been added to your cart.`;
    createNotification(notificationMessage, 'notifications-container', true);


};

(async() => {
    //TODO 9.2 
    // - get the 'products-container' element from the /products.html
    // - get the 'product-template' element from the /products.html
    // - save the response from await getJSON(url) to get all the products. getJSON(url) is available to this script in products.html, as "js/utils.js" script has been added to products.html before this script file 
    // - then, loop throug the products in the response, and for each of the products:
    //    * clone the template
    //    * add product information to the template clone
    //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
    // - remember to add the products to the the page
    // Get the 'products-container' element from products.html
    const productsContainer = document.getElementById('products-container');

    // Get the 'product-template' element from products.html
    const productTemplate = document.getElementById('product-template');

    // Fetch the products from a URL using the getJSON function
    try {
        const products = await getJSON('/api/products'); // Assuming getJSON is available

        // Loop through the products and add them to the page
        products.forEach((product) => {
            const productClone = productTemplate.content.cloneNode(true);

            productClone.querySelector('.product-name').textContent = product.name;
            productClone.querySelector('.product-price').textContent = `$${product.price}`;
            productClone.querySelector('.product-description').textContent = product.description;

            const addToCartButton = productClone.querySelector('button');
            addToCartButton.addEventListener('click', () => {
                addToCart(product._id, product.name); // Assuming addToCart is available
            });

            // Add the product to the page
            productsContainer.appendChild(productClone);
        });
    } catch (error) {
        // Handle any errors from fetching products
        console.error('Error fetching products:', error);
    }
})();