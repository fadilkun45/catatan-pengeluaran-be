import { JwtPayload, jwtDecode } from "jwt-decode";
import { Request, Response } from 'express'
const cryptoJS = require('crypto-js');

export class GenerateHelper {
    static create(req: Request, res: Response){
        const encryptedId = cryptoJS.AES.encrypt(req.body.id.toString(), process.env.KEY_USER!).toString();
        res.status(200).json({
            token: encryptedId
        });
    }
    static decryptToken(token: string){
       let jwtsDecrypt = jwtDecode<JwtPayload | any>(token!).id
       const bytes = cryptoJS.AES.decrypt(jwtsDecrypt,process.env.KEY_USER!);
       const originalId = bytes.toString(cryptoJS.enc.Utf8);
       console.log("id",originalId)
        return originalId
    }
}

