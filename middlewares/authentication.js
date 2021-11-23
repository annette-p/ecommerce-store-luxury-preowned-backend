const crypto = require('crypto');
const { access } = require('fs');
const jwt = require('jsonwebtoken');

// import the User model
const {
    User
} = require('../models');

// Add authentication middleware
const checkIfAuthenticatedJWT = (req, res, next) => {
    // try to get authorization headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // the authHeader will be a string that is like "Bearer <ACCESS_TOKEN>"
        const [authType, token] = authHeader.split(' ');

        if (authType !== "Bearer") {
            return res.sendStatus(403);
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                // store the current logged in user inside req.user
                req.user = user;
                next();
            }
        })
    } else {
        return res.sendStatus(401);
    }
}

const checkIsAdminJWT = (req, res, next) => {
    if (req.user.role !== "Admin") {
        console.log("checkIsAdminJWT - not ADMIN")
        return res.sendStatus(403);
    }
    next();
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAccessToken = (user, tokenType, secret, expiresIn) => {
    let payload = {
        'id': user.get('id')
    }

    if (tokenType === "access_token") {
        payload.role = user.get('type');
        payload.email = user.get('email');
        payload.username = user.get('username');
    }
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
        subject: user.get('email'),
        header: {
            "token_type": tokenType
        }
    });
}

module.exports = {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT,
    getHashedPassword,
    generateAccessToken
};