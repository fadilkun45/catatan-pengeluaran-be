import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
const cryptoJS = require('crypto-js');

export class GenerateHelper {
    static create(req: Request, res: Response){
        const encryptedId = cryptoJS.AES.encrypt(req.body.id.toString(), process.env.KEY_USER!).toString();
        res.status(200).json({
            token: encryptedId
        });
    }
}