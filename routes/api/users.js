const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); 

const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT,
    getHashedPassword,
    generateAccessToken
} = require('../../middlewares/authentication')

// import the User model
const {
    BlacklistedToken,
    User
} = require('../../models');

router.get('/', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    // fetch all the users (i.e., SELECT * FROM users)
    await User.collection().fetch().then(users => {
        let usersResult = users.toJSON()
        // mask out the users' password hash
        res.status(200).send({
            "success": true,
            "data": usersResult
        })
    }).catch(err => {
        console.error("[Exception -> Users GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users.`
        })
        // return;
    });
})

// Get all admin users
router.get('/admins', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    // fetch all the users (i.e., SELECT * FROM users)
    await User.collection().where("type", "Admin").fetch().then(users => {
        let usersResult = users.toJSON()
        // mask out the users' password hash
        res.status(200).send({
            "success": true,
            "data": usersResult
        })
    }).catch(err => {
        console.error("[Exception -> Users GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users.`
        })
        // return;
    });
})

// Get all customers
router.get('/customers', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    // fetch all the users (i.e., SELECT * FROM users)
    await User.collection().where("type", "Customer").fetch().then(users => {
        let usersResult = users.toJSON()
        // mask out the users' password hash
        res.status(200).send({
            "success": true,
            "data": usersResult
        })
    }).catch(err => {
        console.error("[Exception -> Users GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users.`
        })
        // return;
    });
})

// Get info of authenticated user
router.get('/info', checkIfAuthenticatedJWT, async (req, res) => {
    // fetch a user by primary key "id"
    const userId = req.user.id;
    await User.where({
        'id': userId,
        'active': true
    }).fetch({
        require: true
    }).then(user => {
        // mask out the user's password hash
        let userResult = user.toJSON()
        res.status(200).send({
            "success": true,
            "data": userResult
        }); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve user due to unexpected error.`
        })
        return;
    });
})

router.put('/update', checkIfAuthenticatedJWT, async (req, res) => {
    const userId = req.user.id;
    const user = await User.where({
        'id': userId,
        'active': true
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve user information. User update failed. `
        })
        return;
    });

    if (user !== undefined) {

        if (req.body.firstname) { user.set('firstname', req.body.firstname); }
        if (req.body.lastname) { user.set('lastname', req.body.lastname); }
        if (req.body.email) { user.set('email', req.body.email); }
        if (req.body.billing_address) { user.set('billing_address', req.body.billing_address); }
        if (req.body.shipping_address) { user.set('shipping_address', req.body.shipping_address); }
        if (req.body.hasOwnProperty('active')) { user.set('active', req.body.active); }
        user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await user.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `User updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update user due to unexpected error.`
            })
        });
    }

})

router.put('/change-password', checkIfAuthenticatedJWT, async (req, res) => {
    const userId = req.user.id;
    const user = await User.where({
        'id': userId,
        'active': true
    }).fetch({
        require: true
    }).catch(_err => {
        console.log(_err)
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve user information. User change password failed. `
        })
        return;
    });

    if (user !== undefined) {

        // check if the password matches
        const passwordInDB = user.get("password")
        const passwordProvided = getHashedPassword(req.body.current_password)
        if (passwordInDB === passwordProvided) {
            user.set('password', getHashedPassword(req.body.new_password));
            user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            await user.save().then(() => {
                res.status(200).send({
                    "success": true,
                    "message": "Password changed successfully"
                })
            }).catch(_err => {
                res.status(500).send({
                    "success": false,
                    "message": `Unable to change user password due to unexpected error.`
                })
            });
        } else {
            res.status(401).send({
                "success": false,
                "message": `Current password is invalid. Unable to change user password.`
            })
        }
    } else {
        res.status(500).send({
            "success": false,
            "message": `Unable to change user password due to unexpected error.`
        })
    }
})

// When there is a need to delete a user, the user record should remains in the DB but the private 
// personal information should be masked, and one approach is to use uuid for generating random 
// unique string.
// ref: https://www.uuidgenerator.net/dev-corner/javascript
// ref: https://github.com/uuidjs/uuid
router.delete('/delete', [checkIfAuthenticatedJWT], async (req, res) => {
    const userId = req.user.id;
    const user = await User.where({
        'id': userId
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve User ID ${userId}. User deletion failed. `
        })
        return;
    });

    if (user !== undefined) {

        const passwordInDB = user.get("password")
        const passwordProvided = getHashedPassword(req.body.password)

        if (passwordInDB === passwordProvided) {
            user.set('username', uuidv4()); 
            user.set('password', "***"); 
            user.set('firstname', "***"); 
            user.set('lastname', "***");
            user.set('email', uuidv4());
            user.set('billing_address', "***");
            user.set('shipping_address', "***");
            user.set('active', false);
            user.set('federated_login', false); 
            user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

            await user.save().then(() => {
                res.status(200).send({
                    "success": true,
                    "message": `User ID ${userId} deleted successfully`
                })
            }).catch(_err => {
                res.status(500).send({
                    "success": false,
                    "message": `Unable to delete User ID ${userId} due to unexpected error.`
                })
            });
        } else {
            res.status(401).send({
                "success": false,
                "message": `Incorrect password. Unable to delete User ID ${userId}.`
            })
        }

        
    }

})

router.get('/:user_id', async (req, res) => {
    // fetch a user by primary key "id"
    const userId = req.params.user_id
    await User.where({
        'id': userId
    }).fetch({
        require: true
    }).then(user => {
        // mask out the user's password hash
        let userResult = user.toJSON()
        res.status(200).send({
            "success": true,
            "data": userResult
        }); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve users due to unexpected error.`
        })
        return;
    });
})

router.put('/:user_id/update', checkIfAuthenticatedJWT, async (req, res) => {
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

        if (req.body.firstname) { user.set('firstname', req.body.firstname); }
        if (req.body.lastname) { user.set('lastname', req.body.lastname); }
        if (req.body.email) { user.set('email', req.body.email); }
        if (req.body.billing_address) { user.set('billing_address', req.body.billing_address); }
        if (req.body.shipping_address) { user.set('shipping_address', req.body.shipping_address); }
        if (req.body.hasOwnProperty('active')) { user.set('active', req.body.active); }
        if (req.body.hasOwnProperty('federated_login')) { user.set('federated_login', req.body.federated_login); }
        user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

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

// When there is a need to delete a user, the user record should remains in the DB but the private 
// personal information should be masked, and one approach is to use uuid for generating random 
// unique string.
// ref: https://www.uuidgenerator.net/dev-corner/javascript
// ref: https://github.com/uuidjs/uuid
router.delete('/:user_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
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

        user.set('username', uuidv4());
        user.set('password', "***"); 
        user.set('firstname', "***"); 
        user.set('lastname', "***");
        user.set('email', uuidv4());
        user.set('billing_address', "***");
        user.set('shipping_address', "***");
        user.set('active', false);
        user.set('federated_login', false); 
        user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await user.save().then(() => {
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
    user.set('active', true)
    user.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    user.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
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
    });

})

router.post('/authenticate', async (req, res) => {
    // find user by email or username 
    // using 'bookshelf-eloquent' plugin for Bookshelf.js
    // https://www.npmjs.com/package/bookshelf-eloquent
    await User.where(
            "email", req.body.username,
        ).orWhere(
            "username", req.body.username
        ).first()
        .then(async (user) => {
            if (user && user.get("active")) {
                // check if the password matches
                const passwordInDB = user.get("password")
                const passwordProvided = getHashedPassword(req.body.password)
                if (passwordInDB === passwordProvided) {

                    const lastLogin = user.get('last_login_at');
                    user.set('last_login_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
                    await user.save();

                    // TODO: consider shorter validity for access token of customers
                    let accessToken = generateAccessToken(user, "access_token", process.env.TOKEN_SECRET, '15m');
                    let refreshToken = generateAccessToken(user, "refresh_token", process.env.REFRESH_TOKEN_SECRET, '7d')
                    res.status(200).send({
                        accessToken,
                        refreshToken,
                        lastLogin
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

router.post("/refresh", async (req, res) => {
    let refreshToken = req.body.refresh_token;
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    // check if the refresh token has been black listed
    let blacklistedToken;
    try {
        blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
        }).fetch({
            require: false
        });
    } catch(_err) {
        console.log(_err)
        return res.status(500).send({
            "success": false,
            "message": `Failed to refresh the access token due to unexpected error.`
        });
    }
    
    
    // if the refresh token has already been blacklisted
    if (blacklistedToken) {
        res.status(401);
        return res.send({
            "success": false,
            "message": "The refresh token has already expired"
        })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }

        const user = await User.where({
            "id": payload.id,
            "email": payload.sub
        }).fetch({
            require: true
        }).catch(_err => {
            return res.sendStatus(403);
        });

        if (user !== undefined) {
            let accessToken = generateAccessToken(user, "access_token", process.env.TOKEN_SECRET, '15m');
            res.send({
                accessToken
            });
        }
    })

})

router.post("/logout", checkIfAuthenticatedJWT, async (req, res) => {
    let refreshToken = req.body.refresh_token;
    if (!refreshToken) {
        return res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date().toISOString().slice(0, 19).replace('T', ' '));
            await token.save();
            res.status(200).send({
                "success": true,
                "message": "Logged out successfully."
            })
        })
    }
})

module.exports = router;