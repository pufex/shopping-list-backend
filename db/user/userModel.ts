import type { StringifiedId } from "../types"
import mongoose from "mongoose"
import { nameRegex } from "../../constants/regex"

export type UserType = {
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    isAdmin: boolean,
}

export type ResponseUserType = Omit<UserType, "password"> & StringifiedId

export type UserFromFormType = {name: string, password: string}

const UserSchema = new mongoose.Schema<UserType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (val: string) => nameRegex.test(val)
            }
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("User", UserSchema)

export default UserModel