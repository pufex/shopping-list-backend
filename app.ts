import { config } from "dotenv";
config()

import { corsOptions } from "./config/cors";

import express from "express"
import mongoose from "mongoose"

import cors from "cors"
import cookieParser from "cookie-parser";

import UserEndpoints from "./db/user/userEndpoints";
import ProductEndpoints from "./db/product/productEndpoints";
import catchAll from "./catchAll";

const URI = process.env.MONGODB_KEY as string
const PORT = process.env.PORT || 11984

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/auth", UserEndpoints)
app.use("/products", ProductEndpoints)

app.use("/*", catchAll)

mongoose.connect(URI)
    .then(() => {
        console.log("Connected to the Database!")
        app.listen(PORT, () => {
            console.log(`Server running on "http://localhost:${PORT}"!`)
        })
    })
    .catch((err) => {
        console.log("Failed to connect to the Database!")
        console.log(err)
    })

