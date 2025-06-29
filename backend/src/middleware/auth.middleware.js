import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "You are not authorized to access this resource",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }
            throw error;
        }

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

