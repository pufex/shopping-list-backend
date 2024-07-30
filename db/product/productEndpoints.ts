import express from "express"
import verifyJWT from "../../config/verifyJWT"
import checkAdmin from "../../config/checkAdmin"

import { 
    getProducts,
    getUserProducts,
    createProduct,
    deleteAllUserProducts,
    deleteUsersProduct,
} from "./productControllers"

import { 
    ADMIN_getUsersProducts,
    ADMIN_createDefaultProduct,
    ADMIN_updateProduct,
    ADMIN_deleteUserProduct,
} from "./productAdminControllers"

const ProductEndpoints = express.Router()

ProductEndpoints.get("/all",  getProducts)
ProductEndpoints.get("/users", verifyJWT, getUserProducts)
ProductEndpoints.post("/", verifyJWT, createProduct)
ProductEndpoints.delete("/all", verifyJWT, deleteAllUserProducts)
ProductEndpoints.delete("/:id", verifyJWT, deleteUsersProduct)

ProductEndpoints.post("/admin/all", checkAdmin, ADMIN_getUsersProducts)
ProductEndpoints.post("/admin/new", checkAdmin, ADMIN_createDefaultProduct)
ProductEndpoints.patch("/admin/:id", checkAdmin, ADMIN_updateProduct)
ProductEndpoints.delete("/admin/:id", checkAdmin, ADMIN_deleteUserProduct)

export default ProductEndpoints