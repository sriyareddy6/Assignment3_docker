const jwt = require("jsonwebtoken");
const authorize = (req, res, next) => {
    try{
        if (!req.headers.authorization) {
        return res.status(401).send({message: 'UNAUTHORIZED'});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({message: 'UNAUTHORIZED'});
        }
        
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const {_id} = decoded;

        req.userId = _id;
        next();
    } catch {
        next("Authentication failure!");
    }
};

module.exports = authorize;
