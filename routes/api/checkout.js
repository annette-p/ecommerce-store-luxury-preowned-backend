const express = require('express');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const cartServiceLayer = require("../../services/cart")
const {
    checkIfAuthenticatedJWT,
    checkIsCustomerJWT
} = require('../../middlewares/authentication');

let jsonParser = express.json();

router.post('/', [ jsonParser, checkIfAuthenticatedJWT, checkIsCustomerJWT ], async (req, res) => {
    console.log("req.body: ", req.body)
    let userId = req.user.id;
    await cartServiceLayer.getCartByUser(userId).then( async (cartResult) => {
        

        // Create line items
        let cart = cartResult.toJSON();

        let lineItems = [];
        let meta = [];
        for (let item of cart.products) {
            const lineItem = {
                'name': item["name"],
                'images': [ item["product_image_1"] ],
                'amount': item["selling_price"] * 100,  // Stripe price unit is in cents
                'quantity': item["_pivot_quantity"],
                'currency': 'SGD'
            }
            lineItems.push(lineItem);

            // save the quantity data along with the product id
            meta.push({
                'product_id' : item["id"],
                'quantity': item["_pivot_quantity"],
                'unit_price': item["selling_price"] * 100
            })
        }

        // create Stripe payment 
        let metaData = JSON.stringify(meta);
        const payment = {
            client_reference_id: userId,
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['SG'],
            },
            line_items: lineItems,
            // success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
            // cancel_url: process.env.STRIPE_ERROR_URL,
            success_url: req.body.success_url + '?sessionId={CHECKOUT_SESSION_ID}',
            cancel_url: req.body.cancel_url,
            metadata: {
                'orders': metaData
            }
        }

        // register the Stripe session
        let stripeSession = await Stripe.checkout.sessions.create(payment)

        // Provide the Stripe session ID to the client
        res.status(200).send({
            "sessionId": stripeSession,
            "publishableKey": process.env.STRIPE_PUBLISHABLE_KEY
        })
    }).catch(_err => {
        console.log(_err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve carts due to unexpected error.`
        })
        return;
    });
})

// NOTE! This is called by Stripe not internally by us.
// Stripe Webhook signing - must pass the raw request body, exactly as received from 
//  Stripe, to the constructEvent() function; this will not work with a parsed 
//  (i.e., JSON) request body.
// ref: https://github.com/stripe/stripe-node#webhook-signing
router.post('/process_payment', express.raw({type:'application/json'}), async (req,res) =>{

    // payload is what Stripe is sending us
    let payload = req.body;

    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    // extract signature header
    let sigHeader = req.headers['stripe-signature'];

    // verify that the signature is actually from stripe
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        if (event.type ==  "checkout.session.completed") {
            console.log("event type is checkout.session.completed")
            let stripeSession = event.data.object;
            console.log("stripeSession [event.data.object]: ", stripeSession);
            let newOrderId = await cartServiceLayer.createOrder(stripeSession)
            // let metadata = JSON.parse(stripeSession.metadata.orders);
            // console.log("metadata [stripeSession.metadata.orders]: ", metadata);
            res.status(200).send({
                'received': true,
                "order_id": newOrderId
            })
        }
    } catch (e) {
        console.error(e)
        // handle errors
        res.send({
            'error': e.message
        })
    }
    
})

// This will move to store frontend
router.get('/success', function(req,res){
    console.log("Thank your order. Your order has been processed")
    res.send("Thank your order. Your order has been processed");
})

// This will move to store frontend
router.get('/error', function(req,res){
    console.log("Your order has failed or has been cancelled")
    res.send("Your order has failed or has been cancelled");
})

module.exports = router;