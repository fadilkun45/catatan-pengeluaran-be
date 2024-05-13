import dayjs from "dayjs"
import { jwtDecode } from "jwt-decode"
import { Request, Response } from "express";
import { PengeluaranLogModel } from "../models/PengeluaranLogModel";
import isoWeek  from 'dayjs/plugin/isoWeek'

export class FinanceControllers {

    static async getTransaction(req: Request, res: Response) {
        const params: any = req.query
        const getUser: any = jwtDecode(req.get("user-token")!)

        const startdate = params.start_date || dayjs( new Date()).format('YYYY-MM-DD')
        const lastdate = params.last_date || dayjs( new Date()).format('YYYY-MM-DD')

        try {
            // const getData = await PengeluaranLogModel.find({ created_at: {$gte: startdate,  $lte: lastdate } })
            if(params.type === "week"){

                const startOfWeek = dayjs().subtract(7, 'week').format("YYYY-MM-DD")
                const endOfWeek = dayjs().format("YYYY-MM-DD") // End of current week

                const result: any = await PengeluaranLogModel.aggregate([
                    {
                        $match: {
                            created_at: { $gte: startOfWeek, $lte: endOfWeek } // Filter documents within the specified date range
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
                            _id: { week: "$week", year: "$year",},
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                
                ]);
                
               let resultData = await result.map((x: any) => {
                    // const startDateOfYear = dayjs(`${x._id.year}-01-01`);
                    const startDateOfYear = dayjs(`${x._id.year}-01-01`).startOf('year').add(1, 'year')

                    // Menambahkan minggu yang sesuai
                    const targetDate = startDateOfYear.add(x._id.week - 1, 'week');

                    // Mendapatkan nama bulan dan minggu
                    const monthName = targetDate.format('MMMM');
                    const weekInMonth = Math.ceil(targetDate.date() / 7);

                    console.log(`bulan : ${monthName} - minggu : ${weekInMonth}` )

                    return {bulan: monthName, minggu: weekInMonth, total: x.totalAmount}
                    
                })

                res.status(200).json({
                    data: resultData
                })

            }
            if(params.type === "month"){

                const startOfWeek = dayjs().subtract(1, 'month').format("YYYY-MM-DD")
                const endOfWeek = dayjs().format("YYYY-MM-DD") // End of current week

                const result: any = await PengeluaranLogModel.aggregate([
                    {
                        $match: {
                            created_at: { $gte: startOfWeek, $lte: endOfWeek } // Filter documents within the specified date range
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
                            _id: { week: "$week", year: "$year",},
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 }
                        }
                    },
                
                ]);
                
               let resultData =  result.map((x: any) => {
                    const startDateOfYear = dayjs(`${x._id.year}-01-01`);

                    // Menambahkan minggu yang sesuai
                    const targetDate = startDateOfYear.add(x._id.week - 1, 'week');
                    
                    // Mendapatkan nama bulan dan minggu
                    const monthName = targetDate.format('MMMM');
                    const weekInMonth = Math.ceil(targetDate.date() / 7);

                    // console.log(`bulan : ${monthName} - minggu : ${weekInMonth}` )

                    return {bulan: monthName, minggu: weekInMonth, total: x.totalAmount}
                    
                })

                res.status(200).json({
                    data: resultData
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

            const startdate = params.start_date || dayjs( new Date()).format('YYYY-MM-DD')
            const lastdate = params.last_date || dayjs( new Date()).format('YYYY-MM-DD')    

            const count = await PengeluaranLogModel.find({ 'user_id': getUser.id, created_at: { $gte: startdate, $lte: lastdate} }).countDocuments()
            const result: any = await PengeluaranLogModel.aggregate([
                {
                  $match: {
                    created_at: { $gte: startdate, $lt: lastdate},
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
              ])

              res.status(200).json({
                data: result,
                totalData: count
            })

        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);

        }
    }
}