import type { RequestHandler } from "express";
import type { UserFromFormType, ResponseUserType } from "./userModel";

import User from "./userModel";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { nameRegex, passwordRegex } from "../../constants/regex";

export const register: RequestHandler = async (req, res) => {
    const {name, password} = req.body as UserFromFormType
    if(!name || !password) 
        return res.status(400).json({message: "Insufficient Credentials."})
    else if(!nameRegex.test(name))
        return res.status(400).json({message: "Invalid username: username must contain only letters or numbers, must be at least 6 characters long and can't be longer than 30 characters."})
    else if(!passwordRegex.test(password))
        return res.status(400).json({message: "Invalid password: password must include one uppercase and lowercase character, a digit and a special character. Password must have at least 8 characters, but can't be longer than 16 characters."})

    try{
        const userQuery = {name}
        const user = await User.findOne(userQuery)
            .lean().exec()
        if(user)
            return res.status(409).json("User already exists.")
    
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({name, password: hashedPassword})
        res.sendStatus(201)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export const login: RequestHandler = async (req, res) => {
    const {name, password} = req.body as UserFromFormType
    if(!name || !password) 
        return res.status(400).json({message: "Insufficient Credentials."})
    else if(!nameRegex.test(name))
        return res.status(400).json({message: "Invalid username: username must contain only letters or numbers, must be at least 6 characters long and can't be longer than 30 characters."})
    else if(!passwordRegex.test(password))
        return res.status(400).json({message: "Invalid password: password must include one uppercase and lowercase character, a digit and a special character. Password must have at least 8 characters, but can't be longer than 16 characters."})

    const userQuery = {name}
    const user = await User.findOne(userQuery)
        .lean().exec()
    if(!user)
        return res.status(401).json({message: "User not found."})

    const hashedPassword = user.password
    const match = await bcrypt.compare(password, hashedPassword)

    if(!match)
        return res.status(409).json({message: "Wrong username or password"})

    const payload: ResponseUserType = {
        id: user._id.toString(),
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isAdmin: user.isAdmin,
    } 

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "30d" }
    )

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" }
    )

    res.cookie("token", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    res.json({
        isAuthenticated: true, 
        user: payload, 
        token: accessToken
    })
}

export const refresh: RequestHandler = (req, res) => {
    const token = req.cookies.token
    if(!token)
        return res.sendStatus(401)

    return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
        {},
        async (err, decoded) => {
            if(err)
                return res.sendStatus(401)

            const userObj = decoded as ResponseUserType
            const user = await User.findById(userObj.id)
                .lean().exec()
            if(!user)
                return res.sendStatus(401)

            const payload: ResponseUserType = {
                id: user._id.toString(),
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isAdmin: user.isAdmin
            }
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "1h" }
            )
            res.json({
                isAuthenticated: true, 
                user: payload, 
                token: accessToken
            })
        }
    )
}

export const logout: RequestHandler = (req, res) => {
    const token = req.cookies.token
    if(!token)
        return res.sendStatus(204)

    res.clearCookie("token", {
        secure: true,
        httpOnly: true,
        sameSite: "none",
    })
    res.sendStatus(200)
}