import { Request, Response } from "express";
const cryptoJS = require('crypto-js');
import jwt from 'jsonwebtoken'

export class UserController {

    static async login(req: Request, res:Response)  {

        try {
            const bytes = cryptoJS.AES.decrypt(req.body.userToken,process.env.KEY_USER);
            const originalId = bytes.toString(cryptoJS.enc.Utf8);
                
            const token = jwt.sign({ id: originalId }, process.env.KEY_JWT_USER!);
             
            res.status(200).json({
                message: "token berhasil dibuat",
                userToken: token 
            })
        } catch (error) {
            res.status(500).json({
                message: "token tidak valid",
            })
        }

       
    }
}