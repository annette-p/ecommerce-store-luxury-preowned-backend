const express = require("express");
const router = express.Router();
const crypto = require('crypto');

// import the User model
const {
    User
} = require('../../models');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', async (req, res) => {
    // fetch all the users (i.e., SELECT * FROM users)

    // let users = await User.collection().fetch();
    // res.send(users.toJSON()); // convert collection to JSON

    await User.collection().fetch().then(users => {
        res.status(200).send(users.toJSON());
    }).catch(err => {
        console.error("[Exception -> Users GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users.`
        })
        // return;
    });
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
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users due to unexpected error.`
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

        await user.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `User ID ${req.params.user_id} updated successfully`
            })
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
    user.set('username', req.body.username);
    user.set('password', getHashedPassword(req.body.password));
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

router.post('/authenticate', async (req, res) => {
    // find user by email or username 
    // using 'bookshelf-eloquent' plugin for Bookshelf.js
    // https://www.npmjs.com/package/bookshelf-eloquent
    await User.where(
        "email", req.body.email ? req.body.email : ""
    ).orWhere(
        "username", req.body.username ? req.body.username : ""
    ).first()
    .then(user => {
        if (user) {
            // check if the password matches
            const passwordInDB = user.get("password")
            const passwordProvided = getHashedPassword(req.body.password)
            if (passwordInDB === passwordProvided) {
                res.status(200).send({
                    "success": true,
                    "message": `Login Success`
                })
            } else {
                // user exists, but password mismatch
                res.status(401).send({
                    "success": false,
                    "message": `Login Failed`
                })
            }
        } else {
            // user does not exists
            res.status(401).send({
                "success": false,
                "message": `Login Failed`
            })
        }

    }).catch(_err => {
        console.log(_err)
        // something bad happened on the backend
        res.status(500).send({
            "success": false,
            "message": `Login Failed`
        })
        return;
    });
})

module.exports = router;