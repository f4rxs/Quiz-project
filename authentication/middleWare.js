const { verifyToken } = require('./authn');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const userData = verifyToken(token);

        if (userData.role === 'instructor') {
            console.log(userData);
            req.user = userData;
            next();
        } else if (userData.role === 'student') {
            req.user = userData;
            next();
        } else {

            console.log(userData);
            res.sendStatus(403);
        }
    } catch (error) {
        res.sendStatus(403);
    }
};

module.exports = authMiddleware;
