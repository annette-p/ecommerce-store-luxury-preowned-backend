const express = require("express");
const router = express.Router();

// import the User model
const {
    User
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the users (i.e., SELECT * FROM users)

    let users = await User.collection().fetch();
    res.send(users.toJSON()); // convert collection to JSON
})

router.get('/:user_id', async (req, res) => {
    // fetch a user by primary key "id"
    const userId = req.params.user_id
    let user = await User.where({
        'id': userId
    }).fetch();
    res.send(user.toJSON()); // convert collection to JSON
})

router.post('/create', async(req, res) => {
    const user = new User();
    user.set('firstname', req.body.firstname);
    user.set('lastname', req.body.lastname);
    user.set('email', req.body.email);
    user.set('type', req.body.type);
    user.set('billing_address', req.body.billing_address);
    user.set('shipping_address', req.body.shipping_address);
    user.set('federated_login', false);
    await user.save();
    res.status(201).send({
        "success": true,
        "message": "New user created successfully",
        "user_id": user.get("id")
    })
})

module.exports = router;
