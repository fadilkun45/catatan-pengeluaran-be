import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import crypto from 'crypto'

export class GenerateHelper {
    static create(req: Request, res: Response){
        const cipher = crypto.createCipher('aes-256-cbc', process.env.KEY_USER!);
        let encryptedId = cipher.update(req.body.id.toString(), 'utf8', 'hex');
        encryptedId += cipher.final('hex');
        res.status(200).json({
            token: encryptedId
        })
    }
}