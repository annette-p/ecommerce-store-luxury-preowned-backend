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

    /*
        The request body (json) would need to be in this format:

        {
            success_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/success',
            cancel_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/error'
        }
    */
    let userId = req.user.id;
    await cartServiceLayer.getCartByUser(userId).then( async (cartResult) => {

        // Create line items
        let cart = cartResult.toJSON();

        if (cart.products.length > 0) {
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
                success_url: req.body.success_url + '?sessionId={CHECKOUT_SESSION_ID}',
                cancel_url: req.body.cancel_url,
                metadata: {
                    'orders': metaData
                }
            }

            // register the Stripe session
            let stripeSession = await Stripe.checkout.sessions.create(payment)

            /* 
                A sample Stripe session response

                {
                    id: 'cs_test_a10fuPYPSUMZvFyisyDlucuRRahmygTFpkTEV4M169H3kQFHPNGqbZokk0',
                    object: 'checkout.session',
                    after_expiration: null,
                    allow_promotion_codes: null,
                    amount_subtotal: 36000,
                    amount_total: 36000,
                    automatic_tax: { enabled: false, status: null },
                    billing_address_collection: null,
                    cancel_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/error',
                    client_reference_id: '6',
                    consent: null,
                    consent_collection: null,
                    currency: 'sgd',
                    customer: null,
                    customer_details: null,
                    customer_email: null,
                    expires_at: 1639019135,
                    livemode: false,
                    locale: null,
                    metadata: { orders: '[{"product_id":2,"quantity":3,"unit_price":12000}]' },
                    mode: 'payment',
                    payment_intent: 'pi_3K4GTLDJ4PbBbIp613mW1E9r',
                    payment_method_options: {},
                    payment_method_types: [ 'card' ],
                    payment_status: 'unpaid',
                    phone_number_collection: { enabled: false },
                    recovered_from: null,
                    setup_intent: null,
                    shipping: null,
                    shipping_address_collection: { allowed_countries: [ 'SG' ] },
                    shipping_options: [],
                    shipping_rate: null,
                    status: 'open',
                    submit_type: null,
                    subscription: null,
                    success_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
                    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
                    url: 'https://checkout.stripe.com/pay/cs_test_a10fuPYPSUMZvFyisyDlucuRRahmygTFpkTEV4M169H3kQFHPNGqbZokk0#fidkdWxOYHwnPyd1blpxYHZxWjA0T3FKaHdBTzFVZ0dnTHUzXFBOXGB2U2pTdUwyR25TQGcxZDZ%2FY09ARjBUbj1zdGY0THU0cDJQUmFQc09LZ2diXG1CNm1dZnxgQz12SEttbkxXdlx%2FZkpNNTVnM0tvMmQ9SycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
                    }
                    event type is checkout.session.completed
                    stripeSession [event.data.object]:  {
                    id: 'cs_test_a19Od08VV5Mu00Fr3Ts2SCtDW1Lx1CVfNYltMWVl2b776nIM8mKWQ9sMon',
                    object: 'checkout.session',
                    after_expiration: null,
                    allow_promotion_codes: null,
                    amount_subtotal: 36000,
                    amount_total: 36000,
                    automatic_tax: { enabled: false, status: null },
                    billing_address_collection: null,
                    cancel_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/error',
                    client_reference_id: '6',
                    consent: null,
                    consent_collection: null,
                    currency: 'sgd',
                    customer: 'cus_Kjjy1fo6XLsXqO',
                    customer_details: {
                        email: 'bunny@gmail.com',
                        phone: null,
                        tax_exempt: 'none',
                        tax_ids: []
                    },
                    customer_email: null,
                    expires_at: 1639019134,
                    livemode: false,
                    locale: null,
                    metadata: { orders: '[{"product_id":2,"quantity":3,"unit_price":12000}]' },
                    mode: 'payment',
                    payment_intent: 'pi_3K4GTKDJ4PbBbIp601LuhW6y',
                    payment_method_options: {},
                    payment_method_types: [ 'card' ],
                    payment_status: 'paid',
                    phone_number_collection: { enabled: false },
                    recovered_from: null,
                    setup_intent: null,
                    shipping: {
                        address: {
                        city: '',
                        country: 'SG',
                        line1: 'SG',
                        line2: null,
                        postal_code: '12345',
                        state: ''
                        },
                        name: 'Orchard'
                    },
                    shipping_address_collection: { allowed_countries: [ 'SG' ] },
                    shipping_options: [],
                    shipping_rate: null,
                    status: 'complete',
                    submit_type: null,
                    subscription: null,
                    success_url: 'https://3000-magenta-mule-ynqbqphr.ws-us21.gitpod.io/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
                    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
                    url: null
                }
            */

            // Provide the Stripe session id and publishable key to the client
            res.status(200).send({
                "sessionId": stripeSession.id,
                "publishableKey": process.env.STRIPE_PUBLISHABLE_KEY
            })
        } else {
            // no cart items, let's not proceed
            res.status(400).send({
                "success": false,
                "message": `No items in cart`
            })
        }

        
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

module.exports = router;