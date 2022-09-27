const jwt = require('jsonwebtoken');
const JWT_SECRET = "demosecretstring$";

fetchUser = (req, res, next) => {

    //Get the user from the JWT token and add id to request object..
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch (error) {
        res.status(401).send({ error: "please authenticate using lol valid token" });

    }
}

module.exports = fetchUser;