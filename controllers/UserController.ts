import { Request, Response } from "express";
const cryptoJS = require('crypto-js');
import jwt from 'jsonwebtoken'
import { GenerateHelper } from "../helper/generateToken";
import { JwtPayload, jwtDecode } from "jwt-decode";

export class UserController {

    static async login(req: Request, res:Response)  {

        try {
       const bytes = cryptoJS.AES.decrypt(req.body.userToken!,process.env.KEY_USER!);
       const originalId = bytes.toString(cryptoJS.enc.Utf8);
       console.log(originalId)

            if(!originalId){
                return res.status(403).json({
                    message: "user token tidak valid",
                })
            }
            
                
            const token = jwt.sign({ id: req.body.userToken  }, process.env.KEY_JWT_USER!);
             
            res.status(200).json({
                message: "token berhasil dibuat",
                userToken: token 
            })
        } catch (error) {
            res.status(400).json({
                message: "token tidak valid",
            })
        }

       
    }
}