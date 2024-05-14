import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import { apiAuthMiddleware } from "./middleware/middleware"
import { PrivateRouters } from "./routes/PrivateRouters"
import { PublicRouter } from "./routes/PublicRouters"
require("dotenv").config()

const app = express()


app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(apiAuthMiddleware)
app.use(PublicRouter)
app.use(PrivateRouters)

mongoose.connect(process.env.MONGODB_URL!).then(() => console.log("MongoDB is ready")).catch((err) => console.error("Failed to Connect to MongoDB:", err));

app.listen(process.env.PORT || 3400, () => {
    console.log(`App listen in ${process.env.PORT}`)
})

