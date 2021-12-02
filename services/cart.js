const cartDataLayer = require("../dal/carts");
const orderDataLayer = require("../dal/orders");

async function assignCartOwner(cartId, userId) {
    let userCart = await cartDataLayer.getCartByUser(userId)
    if (userCart && userCart.get("id") !== parseInt(cartId)) {
        throw new Error("User already have an existing cart");
    }

    let cart = await getCartById(cartId);
    if (cart && cart.get("user_id") !== null && cart.get("user_id") !== parseInt(userId)) {
        throw new Error(`Cart id ${cartId} is already owned by another user`)
    } else {
        await cartDataLayer.assignCartOwner(cartId, userId);
    }
    
}

// Retrieve the cart for a user 
async function getCartByUser(userId) {
    return await cartDataLayer.getCartByUser(userId);
}

// Retrieve all shopping carts
async function getAllShoppingCarts() {
    try {
        let carts = await cartDataLayer.getAllCartsWithUserInfo()
        return carts;
    } catch (err) {
        throw err
    }
}

// Retrieve a specific cart by id (handle carts belonging to anonymous users)
async function getCartById(cartId) {
    try {
        let cart = await cartDataLayer.getCartById(cartId)
        // TO DO: validate whether cart belongs to a registered user, and does 
        // the request comes from the same registered user
        return cart;
    } catch (err) {
        throw err
    }
}

// Create cart for a user
async function createCart(userId, cartData) {
    if (userId) {
        let cart = await cartDataLayer.getCartByUser(userId)
        if (cart) {
            return await cartDataLayer.updateCart(cart, cartData)
        } else {
            return await cartDataLayer.createCart(userId, cartData);
        }
    } else {
        return await cartDataLayer.createCart(userId, cartData);
    }
}

// Update cart details
async function updateCart(cartId, cartData) {
    let cart = await cartDataLayer.getCartById(cartId)
    return await cartDataLayer.updateCart(cart, cartData)
}

// Update quantity of a specific item in the cart
async function updateQuantityOfCartItem(cartId, productId, newQuantity) {
    try {
        if (newQuantity > 0) {
            await cartDataLayer.updateCartItemQuantity(cartId, productId, newQuantity);
        } else if (newQuantity === 0) {
            await cartDataLayer.removeItemFromCart(cartId, productId);
        } else {
            throw new Error("Cart item quantity should a non-negative numeric value");
        }
    } catch(err) {
        throw err
    }
}

// Create order upon payment completion of the cart
// - input is the Stripe checkout session completed event response received from
//   Stripe via the webhook /checkout/process_payment
//   ref: https://stripe.com/docs/api/checkout/sessions
async function createOrder(completedCheckoutSession) {

    // capture the shipping address from the Stripe checkout session
    // this will be placed in the 'order_shipments' table
    let shippingAddress = `Attention To: ${completedCheckoutSession.shipping.name}
Address Line 1: ${completedCheckoutSession.shipping.address.line1}
Address Line 2: ${completedCheckoutSession.shipping.address.line2}
City: ${completedCheckoutSession.shipping.address.city}
State: ${completedCheckoutSession.shipping.address.state}
Country: ${completedCheckoutSession.shipping.address.country}
Postal Code: ${completedCheckoutSession.shipping.address.postal_code}`

    // capture the required data from he Stripe checkout session to be placed in
    // the 'orders' table
    let orderData = {
        'user_id': completedCheckoutSession.client_reference_id,
        'payment_reference': completedCheckoutSession.payment_intent,
        'payment_method': completedCheckoutSession.payment_method_types[0],
        'shipping_address': shippingAddress,
        'items': []
    }

    // capture the required data from he Stripe checkout session to be placed in
    // the 'orders_products' table
    let orderMetadata = JSON.parse(completedCheckoutSession.metadata.orders);
    orderMetadata.forEach( order => {
        orderData.items.push({
            'product_id': order.product_id,
            'quantity': order.quantity,
            'unit_price': order.unit_price ? order.unit_price : 0
        })
    })

    // create the order
    const orderId = await orderDataLayer.createOrder(orderData);

    // clear the related cart 
    await cartDataLayer.removeCartByUser(completedCheckoutSession.client_reference_id);
    return orderId;
}

module.exports = {
    assignCartOwner,
    createCart,
    createOrder,
    getAllShoppingCarts,
    getCartById,
    getCartByUser,
    updateCart,
    updateQuantityOfCartItem
}