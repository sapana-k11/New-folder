import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id; // Attach userId to request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
