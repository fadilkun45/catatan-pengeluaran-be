import dayjs from "dayjs";
import mongoose from "mongoose";

export type CategoriesType = {
    categories_name: string
    categories_desc: string
    createdAt?: string
    user_id?: string
    time_detail?: string

}

const CategoriesSchema = new mongoose.Schema<CategoriesType>({
    categories_name: {type: String, require: true},
    categories_desc: {type: String},
    time_detail: {type: Date, default: Date.now},
    createdAt: {type: String, default: dayjs().format("YYYY-MM-DD")},
    user_id: {type: String, required: true}
})

export const CategoriesModel = mongoose.model<CategoriesType>(
    "categories",
    CategoriesSchema
)