import type { RequestHandler } from "express"
import path from "path"

const catchAll: RequestHandler = (req, res) => {
    if(req.accepts("html"))
        res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
    else if(req.accepts("application/json"))
        res.status(404).json({message: "404 not found"})
    else res.status(404).send("404 not found (custom)")
} 

export default catchAll