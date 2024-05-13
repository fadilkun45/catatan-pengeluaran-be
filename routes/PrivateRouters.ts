import { Request, Response, Router } from "express";
import { apiAuthMiddleware, apiUserAuthMiddleware } from "../middleware/middleware";
import { PengeluaranLog } from "../controllers/PengeluaranLogController";
import { CategoriesController } from "../controllers/CategoriesController";
import { FinanceControllers } from "../controllers/FinanceController";

export const PrivateRouters = Router()
PrivateRouters.use(apiUserAuthMiddleware)

PrivateRouters.get('/', (req: Request, res: Response) => {
    res.json({
        statusCode: 200,
        message: "Hello world"
    })
})

PrivateRouters.get('/pengeluaranlog', PengeluaranLog.get)
PrivateRouters.post('/pengeluaranlog/create', PengeluaranLog.create)
PrivateRouters.delete('/pengeluaranlog/delete', PengeluaranLog.delete)
PrivateRouters.post('/pengeluaranlog/update', PengeluaranLog.update)

PrivateRouters.get('/categories', CategoriesController.get)
PrivateRouters.post('/categories', CategoriesController.create)
PrivateRouters.delete('/categories/delete', CategoriesController.delete)
PrivateRouters.post('/categories/update', CategoriesController.update)

PrivateRouters.get('/transaction', FinanceControllers.getTransaction)
PrivateRouters.get('/transaction-log', FinanceControllers.getTransactionLog)
