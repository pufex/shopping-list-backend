import type { StringifiedId } from "../types"
import mongoose from "mongoose"

export type ProductType = {
    name: string,
    description: string | null,
    price: number,
    isDiscounted: boolean,
    discount: number | null,
    isKilogrames: boolean,
    user_id: string | null
}

export type ResponseProductType = ProductType & StringifiedId

export type NewProductPayload = Omit<ProductType, "user_id">

const ProductSchema = new mongoose.Schema<ProductType>({
    name: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        default: null
    },
    price: {
        type: Number,
        required: true,
    },
    isDiscounted: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: null
    },
    isKilogrames: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: String,
        default: null
    }
})

const ProductModel = mongoose.model("Product", ProductSchema)

export default ProductModel