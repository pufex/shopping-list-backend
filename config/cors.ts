import type { CorsOptions } from "cors"

const possibleOrigins = new Array(20)
    .fill("")
    .map((_, i) => `http://localhost:${5165+i}`)

export const allowedOrigins = [
    "http://localhost:11984",
    "http://localhost:5174",
    ...possibleOrigins
]

export const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
        if(!origin || allowedOrigins.includes(origin))
            cb(null, true)
        else cb(new Error("Request rejected due to the CORS policy."))
    },
    credentials: true
}