import { Request, Response } from "express";
import crypto, { Decipher } from 'crypto'
import jwt from 'jsonwebtoken'

export class UserController {

    static async login(req: Request, res:Response)  {

        console.log(req.body.userToken)

        try {
            const decryptToken = crypto.createDecipher('aes-256-cbc', process.env.KEY_USER!)
            let decryptedId = decryptToken.update(req.body.userToken, 'hex', 'utf8');
            decryptedId += decryptToken.final('utf8');
    
            const token = jwt.sign({ id: decryptedId }, process.env.KEY_JWT_USER!);
             
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