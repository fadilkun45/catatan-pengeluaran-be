import dayjs from "dayjs"
import { jwtDecode } from "jwt-decode"
import { Request, Response } from "express";
import { PengeluaranLogModel } from "../models/PengeluaranLogModel";
import isoWeek from 'dayjs/plugin/isoWeek'

export class FinanceControllers {

    static async getTransaction(req: Request, res: Response) {
        const params: any = req.query
        const getUser: any = jwtDecode(req.get("user-token")!)
        try {
            if (params.type === "date") {

                const start_date = params.first_date || dayjs().format("YYYY-MM-DD")
                const end_date = params.last_date || dayjs().format("YYYY-MM-DD")

                const result: any = await PengeluaranLogModel.aggregate([
                    {
                        $match: {
                            created_at: { $gte: start_date, $lte: end_date },
                            user_id: getUser.id
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_detail" } },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 },
                            data: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: { "_id": -1 } // Mengurutkan berdasarkan tanggal terbaru
                    }
                ]);

                res.status(200).json({
                    data: result,
                })
            }

            if (params.type === "week") {

                const startOfWeek = dayjs(params.start_date).subtract(7, 'week').format("YYYY-MM-DD") || dayjs().subtract(7, 'week').format("YYYY-MM-DD")
                const endOfWeek = params.last_date || dayjs().format("YYYY-MM-DD") // End of current week

                const result: any = await PengeluaranLogModel.aggregate([
                    {
                        $match: {
                            created_at: { $gte: startOfWeek, $lte: endOfWeek },
                            user_id: getUser.id
                        }
                    },
                    {
                        $project: {
                            week: { $isoWeek: "$time_detail" },
                            year: { $isoWeekYear: "$time_detail" },
                            time_detail: 1,
                            amount: 1,
                        }
                    },
                    {
                        $group: {
                            _id: { week: "$week", year: "$year", },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id": -1 } // Mengurutkan berdasarkan tanggal terbaru
                    }
                ]);

                let resultData = await result.map((x: any) => {
                    const startDateOfYear = dayjs(`${x._id.year}-01-01`).startOf('year').add(1, 'year')

                    const targetDate = startDateOfYear.add(x._id.week - 1, 'week');

                    // Mendapatkan nama bulan dan minggu
                    const monthName = targetDate.format('MMMM');
                    const weekInMonth = Math.ceil(targetDate.date() / 7);
                    // console.log(`bulan : ${monthName} - minggu : ${weekInMonth}` )

                    return { bulan: weekInMonth > 4 ? targetDate.add(1, 'month').format("MMMM") : monthName, minggu: weekInMonth > 4 ? 1 : weekInMonth, total: x.totalAmount }

                })

                res.status(200).json({
                    data: resultData
                })

            }

            if (params.type === "month") {

                const startOfWeek = dayjs().subtract(1, 'month').format("YYYY-MM-DD")
                const endOfWeek = dayjs().format("YYYY-MM-DD") // End of current week

                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                const result = await PengeluaranLogModel.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$time_detail" },
                                month: { $month: "$time_detail" }
                            },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id": -1 } // Mengurutkan berdasarkan tanggal terbaru
                    },
                    {
                        $project: {
                            _id: 0,
                            bulan: "$_id.month",
                            totalAmount: 1,
                            nama_bulan: { $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }] }
                        }
                    }
                ]);


                res.status(200).json({
                    data: result
                })

            }

        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }
    }

    static async getTransactionLog(req: Request, res: Response) {
        try {
            const params: any = req.query
            const getUser: any = jwtDecode(req.get("user-token")!)

            const startdate = params.start_date || dayjs(new Date()).format('YYYY-MM-DD')
            const lastdate = params.last_date || dayjs(new Date()).format('YYYY-MM-DD')

            if (params?.categories) {
                const count = await PengeluaranLogModel.find({ 'user_id': getUser.id, created_at: { $gte: startdate, $lte: lastdate }, categories: params.categories }).countDocuments()

                const result: any = await PengeluaranLogModel.aggregate([
                    {

                        $match: {
                            created_at: { $gte: startdate, $lt: lastdate },
                            user_id: getUser.id,
                            categories: params.categories
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_detail" } },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 },
                            data: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: { "_id": -1 } // Mengurutkan berdasarkan tanggal terbaru
                    }
                ])

                res.status(200).json({
                    data: result,
                    totalData: count
                })

            } else {
                const count = await PengeluaranLogModel.find({ 'user_id': getUser.id, created_at: { $gte: startdate, $lte: lastdate }}).countDocuments()

                const result: any = await PengeluaranLogModel.aggregate([
                    {

                        $match: {
                            created_at: { $gte: startdate, $lt: lastdate },
                            user_id: getUser.id,
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_detail" } },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 },
                            data: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: { "_id": -1 } // Mengurutkan berdasarkan tanggal terbaru
                    }
                ])

                res.status(200).json({
                    data: result,
                    totalData: count
                })

            }



        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);

        }
    }
}