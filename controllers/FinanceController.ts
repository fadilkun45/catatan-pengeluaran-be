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

                const now = new Date();
                const startOfWeek = dayjs().subtract(3, 'week').format("YYYY-MM-DD")
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


                // Append the date range to each result object
                // const resultWithDateRange = result.map(item => {
                //     const { week, year } = item._id;
                //     const startOfWeekDate = dayjs().isoWeekYear(year).isoWeek(week).startOf('week').toDate();
                //     const endOfWeekDate = dayjs().isoWeekYear(year).isoWeek(week).endOf('week').toDate();
                //     return {
                //         ...item,
                //         startOfWeek: startOfWeekDate,
                //         endOfWeek: endOfWeekDate
                //     };
                // });
        
                // console.log(resultWithDateRange);


            
                let sum: number = 0
                
                result.map((x: any) => {
                    const startDateOfYear = dayjs(`${x._id.year}-01-01`);

                    // Menambahkan minggu yang sesuai
                    const targetDate = startDateOfYear.add(x._id.week - 1, 'week');
                    
                    // Mendapatkan nama bulan dan minggu
                    const monthName = targetDate.format('MMMM');
                    const weekInMonth = Math.ceil(targetDate.date() / 7);

                    console.log(`bulan : ${monthName} - minggu : ${weekInMonth}` )
                    
                })


                console.log(dayjs(startOfWeek).format("YYYY-MM-DD"))
                console.log("test",result)

                return
            }
        } catch (error) {
            res.status(500).send(`salah fe : ${error}`);
        }

     

    }
}