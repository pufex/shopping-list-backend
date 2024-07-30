import express from "express"

import { 
    login,
    register,
    refresh,
    logout
} from "./userControllers"

import checkAdmin from "../../config/checkAdmin"
import { ADMIN_createAdminUser } from "./userAdminControllers"

const UserEndpoints = express.Router()

UserEndpoints.post("/login", login)
UserEndpoints.post("/register", register)
UserEndpoints.get("/refresh", refresh)
UserEndpoints.get("/logout", logout)

UserEndpoints.post("/admin/new", ADMIN_createAdminUser)

export default UserEndpoints