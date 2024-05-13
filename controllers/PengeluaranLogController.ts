import { Request, Response } from "express";
import { PengeluaranLogModel } from "../models/PengeluaranLogModel";
import { JwtPayload, jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export class PengeluaranLog {

    static async create(req: Request, res: Response) {

        let savedData = req.body
        savedData.user_id = jwtDecode<JwtPayload | any>(req.get("user-token")!).id

        try {

            savedData.created_at = dayjs(savedData.created_at).format('YYYY-MM-DD')
            savedData.time_detail = dayjs(savedData.created_at).add(1, 'day').toISOString()

            const postData = await PengeluaranLogModel.create(savedData)
            const result = await postData.save()

            res.status(200).json({
                data: result
            });
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }
    }

    static async update(req: Request, res: Response) {

        let savedData = req.body

        savedData.created_at = dayjs(savedData.created_at).format('YYYY-MM-DD')
        savedData.time_detail = dayjs(savedData.created_at).add(1, 'day').toISOString()

        savedData.user_id = jwtDecode<JwtPayload | any>(req.get("user-token")!).i

        try {
            if(!await PengeluaranLogModel.findOne({ _id: savedData.id})){
                return res.status(404).send(`data tidak ditemukan`);
            }

            await PengeluaranLogModel.findOneAndUpdate({ _id: savedData.id}, savedData)
            const updateData = await PengeluaranLogModel.findOne({ _id: savedData.id})

            res.status(200).json({
                data: updateData
            });
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }

    }

    static async delete(req: Request, res: Response) {
        try {

            if(!await PengeluaranLogModel.findOne({ _id:req.body.id})){
                return res.status(404).send(`data tidak ditemukan`);
            }

            await PengeluaranLogModel.findOneAndDelete({ _id:req.body.id})
            
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
            if (params.page_size && params.page && (!params.start_date || !params.end_date)) {
                const getPengeluaranLog = await PengeluaranLogModel.find({ 'user_id': getUser.id,}).sort({time_detail: -1}).skip((parseInt(params.page) - 1) * params.page_size ).limit(parseInt(params.page_size))
                const getAllData = await PengeluaranLogModel.find({ 'user_id': getUser.id }).countDocuments()
                return res.status(200).json({
                    data: getPengeluaranLog,
                    page: params.page,
                    page_size: params.page_size,
                    total_page: Math.round(getAllData / params.page_size) || 1,
                    total_data: getAllData
                })
            }
            if (params.id) {
                const getPengeluaranLog = await PengeluaranLogModel.findOne({ '_id': params.id })
               return res.status(200).json({
                    data: getPengeluaranLog 
                })
            }
            if (params.categories_id) {
                const getPengeluaranLog = await PengeluaranLogModel.find({ 'categories': params.categories_id })
                const getAllData = await PengeluaranLogModel.find({ 'categories': params.categories_id }).countDocuments()

               return res.status(200).json({
                    data: getPengeluaranLog,
                    total_data: getAllData
                })
            }
            if(params.start_date || params.last_date){

                const startdate = params.start_date || dayjs( new Date()).format('YYYY-MM-DD')
                const lastdate = params.last_date || dayjs( new Date()).format('YYYY-MM-DD')
             

                const getPengeluaranLog = await PengeluaranLogModel.find({ 'user_id': getUser.id, created_at: { $gte: startdate, $lte: lastdate} }).sort({time_detail: -1})
                const getAllData = await PengeluaranLogModel.find({ 'user_id': getUser.id, created_at: { $gte: startdate, $lte: lastdate} }).countDocuments()
                return res.status(200).json({
                    data: getPengeluaranLog,
                    page: params.page,
                    page_size: params.page_size,
                    total_page: Math.round(getAllData / params.page_size) || 1,
                    total_data: getAllData
                })
            }
            res.status(200).json({
                message: "fe bawa param apa"
            })
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }


    }
}