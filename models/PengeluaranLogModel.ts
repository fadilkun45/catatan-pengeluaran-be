import dayjs from "dayjs"
import mongoose from "mongoose"

export type PengeluaranLogType = {
    pengeluaran_name : string 
    pengeluaran_desc?: string
    categories?: string[]
    amount: number
    created_at?: string
    user_id: string 
    time_detail?: string
}

const PengeluaranLogSchema = new mongoose.Schema<PengeluaranLogType>({
    pengeluaran_name: { type: String, required: true},
    pengeluaran_desc: { type: String},
    categories: {type: [String]},
    amount: {type: Number,  required: true},
    time_detail: {type: Date, required: true},
    created_at: {type: String, required: true},
    user_id: {type: String, required: true}
})

export const PengeluaranLogModel = mongoose.model<PengeluaranLogType>(
    "PengeluaranLog",
    PengeluaranLogSchema
)

