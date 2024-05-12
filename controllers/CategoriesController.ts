import { Request, Response } from "express";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { CategoriesModel } from "../models/CategoriesModel";

export class CategoriesController {

    static async create(req: Request, res: Response) {

        let savedData = req.body
        savedData.user_id = jwtDecode<JwtPayload | any>(req.get("user-token")!).id


        try {
            const postData = await CategoriesModel.create(savedData)
            const result = await postData.save()

            delete result.user_id
            delete result.__v

            res.status(200).json({
                data: result
            });
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }

    }

    static async update(req: Request, res: Response) {

        let savedData = req.body
        savedData.user_id = jwtDecode<JwtPayload | any>(req.get("user-token")!).id


        try {
            if(!await CategoriesModel.findOne({ _id: savedData.id})){
                return res.status(404).send(`data tidak ditemukan`);
            }

             await CategoriesModel.findOneAndUpdate({ _id: savedData.id}, savedData)
             const updateData = await CategoriesModel.findOne({ _id: savedData.id})

            res.status(200).json({
                data: updateData
            });
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }

    }

    static async delete(req: Request, res: Response) {

        try {
            if(!await CategoriesModel.findOne({ _id:req.body.id})){
               return res.status(404).send(`data tidak ditemukan`);
            }

            await CategoriesModel.findOneAndDelete({ _id:req.body.id})
            
            res.status(200).json({
                message: "delete berhasil"
            });

        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }
    }

    static async get(req: Request, res: Response) {
        const params: any = req.query
        const getUser: any = jwtDecode(req.get("user-token")!)

        try {
            if (params.page_size && params.page) {
                const getCategories = await CategoriesModel.find({ 'user_id': getUser.id }).skip((parseInt(params.page) - 1) * params.page_size).limit(parseInt(params.page_size))
                const getAllData = await CategoriesModel.find({ 'user_id': getUser.id }).countDocuments()
                return res.status(200).json({
                    data: getCategories,
                    page: params.page,
                    page_size: params.page_size,
                    total_page: Math.round(getAllData / params.page_size) || 1,
                    total_data: getAllData
                })
            }
            if (params.id) {
                const getCategories = await CategoriesModel.findOne({ '_id': params.id })
                return res.status(200).json({
                    data: getCategories
                })
            }

            const getCategories = await CategoriesModel.find({ 'user_id': getUser.id })
            return res.status(200).json({
                data: getCategories
            })

        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }

    }
}