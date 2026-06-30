const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing",
        });
    }

    try {

        const jwtToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        res.status(401).json({
            success: false,
            message: "Invalid Token",
        });

    }
};

module.exports = auth;