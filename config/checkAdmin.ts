import type { ResponseUserType } from "../db/user/userModel";
import type { RequestHandler } from "express";
import User from "../db/user/userModel";
import jwt from "jsonwebtoken"

const checkAdmin: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.sendStatus(403)
    
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        {},
        async (err, decoded) => {
            if(err)
                return res.sendStatus(403)
        
            const userObj = decoded as ResponseUserType
            const user = await User.findById(userObj.id)
                .lean().exec()
            if(!user)
                return res.sendStatus(401)

            if(!user.isAdmin)
                return

            const userPayload: ResponseUserType = {
                id: user._id.toString(), 
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isAdmin: user.isAdmin,
            }
            req.user = userPayload
            next()
        }
    )
}   

export default checkAdmin