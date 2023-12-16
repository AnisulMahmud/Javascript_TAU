const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file

  addProductToCart(productId);
  updateProductAmount(productId);

};

const decreaseCount = productId => {
    // TODO 9.2
    // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
    // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId
    decreaseProductCount(productId);
    const updatedCount = getProductCountFromCart(productId);
    updateProductAmount(productId);
    if (updatedCount === 0) {
        // If the amount is 0, remove the product from the cart
        removeElement('cart-container', productId); // Replace 'cart-container' with your actual container ID
    }
};

const updateProductAmount = productId => {
    // TODO 9.2
    // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
    // - change the amount of products shown in the right element's innerText
    const productCount = getProductCountFromCart(productId);
    const parentElement = document.getElementById(productId);
    const childElement = parentElement.querySelector('.product-amount');
    if (childElement) {
        // Update the amount shown in the right element's innerText
        childElement.innerText = productCount + 'x';
    }

};

const placeOrder = async() => {
    // TODO 9.2
    // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
    // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
    // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)

    const cartProducts = getAllProductsFromCart();
    createNotification('Successfully placed the order!', 'notifications-container', true);

    // console.log(cartProducts)
    // cartProducts.forEach((product) => {
    //     const productId = product.id;
    //     const productName = product.name;
    //     removeElement('cart-container', productId);
    //     const notificationMessage = `Succesfully created an order!`;
    //     createNotification(notificationMessage, 'notifications-container', true);
    // });
    // Remove each product from the cart and show a success notification
    cartProducts.forEach((product) => {
        removeElement('cart-container', product.name);
    });
    clearCart()
        // return null;

};

(async() => {
    // TODO 9.2
    // - get the 'cart-container' element
    // - use getJSON(url) to get the available products
    // - get all products from cart
    // - get the 'cart-item-template' template
    // - for each item in the cart
    //    * copy the item information to the template
    //    * hint: add the product's ID to the created element's as its ID to 
    //        enable editing ith 
    //    * remember to add event listeners for cart-minus-plus-button
    //        cart-minus-plus-button elements. querySelectorAll() can be used 
    //        to select all elements with each of those classes, then its 
    //        just up to finding the right index.  querySelectorAll() can be 
    //        used on the clone of "product in the cart" template to get its two
    //        elements with the "cart-minus-plus-button" class. Of the resulting
    //        element array, one item could be given the ID of 
    //        `plus-${product_id`, and other `minus-${product_id}`. At the same
    //        time we can attach the event listeners to these elements. Something 
    //        like the following will likely work:
    //          clone.querySelector('button').id = `add-to-cart-${prodouctId}`;
    //          clone.querySelector('button').addEventListener('click', () => addToCart(productId, productName));
    //
    // - in the end remember to append the modified cart item to the cart 
    document.getElementById('place-order-button').addEventListener('click', () => {
        placeOrder();
    })
    const cartContainer = document.getElementById('cart-container');
    const availableProducts = (await getJSON('/api/products'));
    // console.log(availableProducts)
    const cartProducts = getAllProductsFromCart();
    const cartItemTemplate = document.getElementById('cart-item-template');

    cartProducts.forEach((cartItem) => {
        const cartItemClone = cartItemTemplate.content.cloneNode(true);
        const productWithMatchingName = availableProducts.find(product => {
            // console.log(product.name);
            // console.log(cartItem.name);
            return product._id === cartItem.name
        });
        // console.log(typeof productWithMatchingName)
        const productId = productWithMatchingName._id;
        // console.log(productId)
        cartItemClone.querySelector('.item-row').id = productId;
        cartItemClone.querySelector('.product-name').textContent = productWithMatchingName.name;
        cartItemClone.querySelector('.product-name').id = `name-${productId}`;
        cartItemClone.querySelector('.product-price').textContent = productWithMatchingName.price;
        cartItemClone.querySelector('.product-price').id = `price-${productId}`;
        cartItemClone.querySelector('.product-amount').textContent = cartItem.amount + 'x';
        cartItemClone.querySelector('.product-amount').id = `amount-${productId}`;


        // const plusButton = cartItemClone.querySelector(`.plus - $ { productId }`);
        // const minusButton = cartItemClone.querySelector(`.minus - $ { productId }`);
        const buttons = cartItemClone.querySelectorAll(`.cart-minus-plus-button `);
        // buttons.classList.add(`plus - $ { productId }`);
        buttons[0].id = `plus-${productId }`;
        buttons[1].id = `minus-${productId }`;

        // console.log(buttons)
        const newPlusButton = cartItemClone.querySelector(`#plus-${ productId }`)
            //     // const minusButton = cartItemClone.querySelector(`.cart - minus - minus - button `);
            //     // minusButton.classList.add(`minus - $ { productId }`);
        const newMinusButton = cartItemClone.querySelector(`#minus-${productId}`)


        newPlusButton.addEventListener('click', () => {
            addToCart(productId);
        });

        newMinusButton.addEventListener('click', () => {
            decreaseCount(productId);
        });

        cartContainer.appendChild(cartItemClone);
    });


  cartProducts.forEach((cartItem) => {
      const cartItemClone = cartItemTemplate.content.cloneNode(true);
      const productWithMatchingName = availableProducts.find(product => {
          // console.log(product.name);
          // console.log(cartItem.name);
          return product._id === cartItem.name
      });
      // console.log(typeof productWithMatchingName)
      const productId = productWithMatchingName._id;
      // console.log(productId)
      cartItemClone.querySelector('.item-row').id = productId;
      cartItemClone.querySelector('.product-name').textContent = productWithMatchingName.name;
      cartItemClone.querySelector('.product-name').id = `name-${productId}`;
      cartItemClone.querySelector('.product-price').textContent = productWithMatchingName.price;
      cartItemClone.querySelector('.product-price').id = `price-${productId}`;
      cartItemClone.querySelector('.product-amount').textContent = cartItem.amount + 'x';
      cartItemClone.querySelector('.product-amount').id = `amount-${productId}`;


      // const plusButton = cartItemClone.querySelector(`.plus - $ { productId }`);
      // const minusButton = cartItemClone.querySelector(`.minus - $ { productId }`);
      const buttons = cartItemClone.querySelectorAll(`.cart-minus-plus-button `);
      // buttons.classList.add(`plus - $ { productId }`);
      buttons[0].id = `plus-${productId }`;
      buttons[1].id = `minus-${productId }`;

      // console.log(buttons)
      const newPlusButton = cartItemClone.querySelector(`#plus-${ productId }`)
          //     // const minusButton = cartItemClone.querySelector(`.cart - minus - minus - button `);
          //     // minusButton.classList.add(`minus - $ { productId }`);
      const newMinusButton = cartItemClone.querySelector(`#minus-${productId}`)


      newPlusButton.addEventListener('click', () => {
          addToCart(productId);
      });

      newMinusButton.addEventListener('click', () => {
          decreaseCount(productId);
      });

      cartContainer.appendChild(cartItemClone);
  });


})();
