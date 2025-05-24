// require('dotenv').config({ path: './env' })

import dotenv from "dotenv"
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js";
import connectDb from "./db/index.js";

dotenv.config({
    path: './.env'
})




connectDb()
    .then(() => {
        app.on("error", () => {
            console.error("Server error", error);
            throw error
        })
        app.listen(process.env.PORT || 8000), () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`)
        }
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!!", err);
    });







/*
import express from "express"
const app = express()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            app.on("error", () => {
                console.log("Error", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })
        } catch (error) {
            console.error(error);
            throw err
        }
    })()

*/