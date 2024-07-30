import type { RequestHandler } from "express";
import type { UserFromFormType } from "./userModel";

import User from "./userModel";
import bcrypt from "bcrypt"

import { 
    nameRegex,
    passwordRegex
} from "../../constants/regex";

export const ADMIN_createAdminUser: RequestHandler = async (req, res) => {
    const {name, password} = req.body as UserFromFormType

    if(!name || !password)
        return res.status(400).json({message: "Insufficient credentials."})
    if(!nameRegex.test(name))
        return res.status(400).json({message: "Invalid username: username must contain only letters or numbers, must be at least 6 characters long and can't be longer than 30 characters."})
    else if(!passwordRegex.test(password))
        return res.status(400).json({message: "Invalid password: password must include one uppercase and lowercase character, a digit and a special character. Password must have at least 8 characters, but can't be longer than 16 characters."})
 
    const existingUserQuery = {name}
    const existingUser = await User.findOne(existingUserQuery)
    if(existingUser)
        return res.status(409).json({message: "Username is taken"})

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({name, password: hashedPassword, isAdmin: true})
    res.sendStatus(201)
}