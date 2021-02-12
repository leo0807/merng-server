const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            jwt.verify(token, SECRET_KEY, function (err, decoded) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(decoded)
                }
            })
            try {
                const user = jwt.verify(token, SECRET_KEY);
                console.log(user);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};
