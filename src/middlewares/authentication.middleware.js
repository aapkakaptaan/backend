import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Try to get the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // If token is not provided, reject the request
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // Verify the token using the secret from environment variables
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Fetch user from database using ID from the token, excluding sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // Attach user object to request so downstream middleware/routes can use it
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access TOken")
    }

})