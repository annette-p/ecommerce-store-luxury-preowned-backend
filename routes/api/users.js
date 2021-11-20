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
    await User.where({
        'id': userId
    }).fetch({
        require: true
    }).then(user => {
        res.status(200).send(user.toJSON()); // convert collection to JSON
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve User ID ${req.params.user_id}.`
        })
        return;
    });
})

router.put('/:user_id/update', async (req, res) => {
    const user = await User.where({
        'id': req.params.user_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve User ID ${req.params.user_id}. User update failed. `
        })
        return;
    });

    if (user !== undefined) {

        user.set('firstname', req.body.firstname);
        user.set('lastname', req.body.lastname);
        user.set('email', req.body.email);
        user.set('type', req.body.type);
        user.set('billing_address', req.body.billing_address);
        user.set('shipping_address', req.body.shipping_address);
        user.set('federated_login', false);

        await user.save();
        res.status(200).send({
            "success": true,
            "message": `User ID ${req.params.user_id} updated successfully`
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update User ID ${req.params.user_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:user_id/delete', async (req, res) => {
    const user = await User.where({
        'id': req.params.user_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve User ID ${req.params.user_id}. User deletion failed. `
        })
        return;
    });

    if (user !== undefined) {
        await user.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `User ID ${req.params.user_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete User ID ${req.params.user_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', async (req, res) => {
    const user = new User();
    user.set('firstname', req.body.firstname);
    user.set('lastname', req.body.lastname);
    user.set('email', req.body.email);
    user.set('type', req.body.type);
    user.set('billing_address', req.body.billing_address);
    user.set('shipping_address', req.body.shipping_address);
    user.set('federated_login', false);
    await user.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New user created successfully",
            "user_id": user.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new user due to unexpected error.`
        })
    });;

})

module.exports = router;