import type { ResponseProductType, NewProductPayload, ProductType } from "./productModel";
import type { RequestHandler } from "express";
import Product from "./productModel";
import mongoose from "mongoose"

export const getProducts: RequestHandler = async (req, res) => {
    try{
        const productsQuery = {user_id: null}
        const products = await Product.find(productsQuery)
            .lean().exec()
        const refinedProducts: ResponseProductType[] = products.map(
            (product) => {
                return {
                    id: product._id.toString(),
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    isDiscounted: product.isDiscounted,
                    discount: product.discount,
                    isKilogrames: product.isKilogrames,
                    user_id: product.user_id
                }
            }
        )
        res.json(refinedProducts)
    }catch(err){
        res.sendStatus(500)
    }
}

export const getUserProducts: RequestHandler = async (req,res) => {
    const user = req.user
    if(!user)
        return res.sendStatus(500)
    
    try{
        const userProductsQuery = {user_id: user.id}
        const userProducts = await Product.find(userProductsQuery)
            .lean().exec()
        const refinedUserProdcuts: ResponseProductType[] = userProducts.map(
            (product) => {
                return {
                    id: product._id.toString(),
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    isDiscounted: product.isDiscounted,
                    discount: product.discount,
                    isKilogrames: product.isKilogrames,
                    user_id: product.user_id
                }
            }
        )
        res.json(refinedUserProdcuts)
    }catch{
        res.sendStatus(500)
    }
}

export const createProduct: RequestHandler = async (req, res) => {
    const user = req.user
    if(!user)
        return res.sendStatus(500)

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
        user_id: user.id
    }

    try{
        const newProduct = await Product.create(payload)
        const refinedProduct: ResponseProductType = {
            id: newProduct._id.toString(),
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            isDiscounted: newProduct.isDiscounted,
            discount: newProduct.discount,
            isKilogrames: newProduct.isKilogrames,
            user_id: newProduct.user_id
        }
        res.json(refinedProduct)
    }catch{
        res.sendStatus(500)
    }
}

export const deleteAllUserProducts: RequestHandler = async (req, res) => {
    const user = req.user
    if(!user)
        return res.sendStatus(500)

    try{
        const userProductsQuery = {user_id: user.id}
        await Product.deleteMany(userProductsQuery)
        res.sendStatus(200)
    }catch{
        res.sendStatus(500)
    }
}

export const deleteUsersProduct: RequestHandler = async (req, res) => {
    const user = req.user
    if(!user)
        return res.sendStatus(500)

    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({message: "Invalid product id (delete users product)."})

    try{
        const product = await Product.findById(id)
            .exec()
        if(!product)
            return res.sendStatus(204)

        const {user_id} = product
        if(user_id !== user.id)
            return res.status(409).json({message: "You're not allowed to delete somebody else's product. "})
        else await product.deleteOne()
        res.sendStatus(200)
    }catch{
        res.sendStatus(500)
    }
}