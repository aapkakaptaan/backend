// Import required modules
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the user schema using Mongoose
const userSchema = new Schema({
    // Unique username, stored in lowercase and trimmed
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    // User's email, must be unique, stored in lowercase and trimmed
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Full name of the user, trimmed and indexed
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    // URL of the user's avatar (stored on Cloudinary)
    avatar: {
        type: String,
        required: true
    },
    // Optional cover image URL
    coverImage: {
        type: String,
    },
    // Watch history containing references to Video documents
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    // Password for authentication
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    // Refresh token for generating new access tokens
    refreshToken: {
        type: String,
    }
}, {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true
});

// Mongoose middleware: Hash the password before saving the user document
userSchema.pre("save", async function (next) {
    // Only hash the password if it's new or modified
    if (!this.isModified("password")) return next();

    // Hash the password using bcrypt with salt rounds = 10
    this.password = await bcrypt.hashSync(this.password, 10);
    next();
});

// Method to compare entered password with hashed password stored in DB
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate JWT access token with limited lifespan
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

// Method to generate JWT refresh token with longer lifespan
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

// Export the User model to use in other parts of the application
export const User = mongoose.model("User", userSchema);
