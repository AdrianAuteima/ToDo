const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Token no proporcionado"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Token inválido"
        });
    }
};

module.exports = auth;