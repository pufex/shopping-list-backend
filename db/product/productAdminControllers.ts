import type { RequestHandler } from "express";
import type {
    ProductType,
    ResponseProductType, 
    NewProductPayload 
} from "./productModel";

import Product from "./productModel";
import User from "../user/userModel";
import mongoose from "mongoose"

export const ADMIN_getUsersProducts: RequestHandler = async (req, res) => {
    const {name} = req.body
    console.log("Username:", name)
    if(typeof name !== "string")
        return res.status(400).json({message: "Invalid username"})
    try{
        const userQuery = {name}
        const user = await User.findOne(userQuery)
            .lean().exec()
        if(!user)
            return res.status(404).json({message: "User not found."})

        const user_id = user._id.toString()
        const userProductsQuery = {user_id}
        const userProducts = await Product.find(userProductsQuery)
            .exec()

        const refinedProducts: ResponseProductType[] = userProducts.map(product => ({
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            isDiscounted: product.isDiscounted,
            discount: product.discount,
            isKilogrames: product.isKilogrames,
            user_id: product.user_id
        }))
        res.json(refinedProducts)
    }catch{
        res.sendStatus(500)
    }
}

export const ADMIN_createDefaultProduct: RequestHandler = async (req, res) => {
    const {
        name, 
        price, 
        description, 
        isDiscounted, 
        discount, 
        isKilogrames
    } = req.body as NewProductPayload

    const payload: ProductType = {
        name, 
        price, 
        description, 
        isDiscounted, 
        discount, 
        isKilogrames,
        user_id: null
    }

    try{
        const newProduct = await Product.create(payload)
        res.json(newProduct)
    }catch{
        res.sendStatus(500)
    }

}

export const ADMIN_updateProduct: RequestHandler = async (req, res) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid product id (update product)"})

    const {
        name,
        price,
        description,
        discount,
        isDiscounted,
        isKilogrames,
    } = req.body as NewProductPayload

    try{
        const product = await Product.findById(id)
            .exec()
        if(!product)
            return res.status(404).json({message: "Product not found."})

        product.name = name
        product.price = price
        product.description = description
        product.discount = discount
        product.isDiscounted = isDiscounted
        product.isKilogrames = isKilogrames

        await product.save()

        const refinedProduct: ResponseProductType = {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            isDiscounted: product.isDiscounted,
            discount: product.discount,
            isKilogrames: product.isKilogrames,
            user_id: product.user_id
        }

        res.status(200).json(refinedProduct)
    }catch{
        res.sendStatus(500)
    }
}

export const ADMIN_deleteUserProduct: RequestHandler = async (req, res) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid user Id (delete product)"})

    try{
        const product = await Product.findById(id)
        if(!product)
            return res.sendStatus(204)
        await product.deleteOne()
        res.sendStatus(200)
    }catch(err){
        res.sendStatus(500)
    }
}

