require("dotenv").config();
var jwt = require("jsonwebtoken");


module.exports = {
    verifyRole: function(role) {
        return function(req, res, next) {
            const token = req.body.token || req.headers["token"];

            if (token) {
                jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
                    if (err ||  decode.role_id != role) {
                        res.status(403).send({
                            status: "error",
                            msg: "authentication failed",
                        });
                    } else {
                        next();
                    }
                });
            } else {
                res.status(401).send({
                    msg: "please send the token",
                });
            }
        }
    },

}