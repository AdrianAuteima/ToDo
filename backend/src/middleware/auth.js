import jwt from "jsonwebtoken";

function getUserFromToken(token) {
    if(!token) return null;

    try {
        const actualToken = token.replace("Bearer ", "");
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || "fallback_secret");
        return decoded;
    } catch(error) {
        console.error("Token invalido")
        return null;
    }
};

export default getUserFromToken;